from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import hashlib
import secrets

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_token() -> str:
    return secrets.token_urlsafe(32)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user = await db.users.find_one({"token": token})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Models
class UserCreate(BaseModel):
    fullName: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None

class PasswordChange(BaseModel):
    currentPassword: str
    newPassword: str

class UserResponse(BaseModel):
    id: str
    fullName: str
    email: str
    avatar: Optional[str] = None

class AuthResponse(BaseModel):
    user: UserResponse
    token: str

class MenuItem(BaseModel):
    id: str
    name: str
    price: str
    image: Optional[str] = None

class Restaurant(BaseModel):
    id: str
    name: str
    address: str
    rating: float
    image: str
    cuisine: str
    country: str
    description: Optional[str] = None
    menu: List[MenuItem] = []

class FavoriteCreate(BaseModel):
    restaurantId: str

class Favorite(BaseModel):
    id: str
    userId: str
    restaurantId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

# Auth Routes
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    token = create_token()
    user_id = str(uuid.uuid4())
    
    user_doc = {
        "id": user_id,
        "fullName": user_data.fullName,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "token": token,
        "avatar": None,
        "createdAt": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    
    return AuthResponse(
        user=UserResponse(
            id=user_id,
            fullName=user_data.fullName,
            email=user_data.email,
            avatar=None
        ),
        token=token
    )

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate new token on login
    token = create_token()
    await db.users.update_one({"id": user["id"]}, {"$set": {"token": token}})
    
    return AuthResponse(
        user=UserResponse(
            id=user["id"],
            fullName=user["fullName"],
            email=user["email"],
            avatar=user.get("avatar")
        ),
        token=token
    )

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_profile(user_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {}
    if user_data.fullName:
        update_data["fullName"] = user_data.fullName
    if user_data.email:
        # Check if email is taken by another user
        existing = await db.users.find_one({"email": user_data.email, "id": {"$ne": current_user["id"]}})
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        update_data["email"] = user_data.email
    
    if update_data:
        await db.users.update_one({"id": current_user["id"]}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": current_user["id"]})
    return UserResponse(
        id=updated_user["id"],
        fullName=updated_user["fullName"],
        email=updated_user["email"],
        avatar=updated_user.get("avatar")
    )

@api_router.put("/auth/password")
async def change_password(password_data: PasswordChange, current_user: dict = Depends(get_current_user)):
    if not verify_password(password_data.currentPassword, current_user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"password": hash_password(password_data.newPassword)}}
    )
    
    return {"message": "Password updated successfully"}

class AvatarUpdate(BaseModel):
    avatar: str

@api_router.put("/auth/avatar", response_model=UserResponse)
async def update_avatar(avatar_data: AvatarUpdate, current_user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"avatar": avatar_data.avatar}}
    )
    
    updated_user = await db.users.find_one({"id": current_user["id"]})
    return UserResponse(
        id=updated_user["id"],
        fullName=updated_user["fullName"],
        email=updated_user["email"],
        avatar=updated_user.get("avatar")
    )

# Restaurant Routes
@api_router.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants():
    restaurants = await db.restaurants.find().to_list(100)
    if not restaurants:
        # Seed with sample data if empty
        await seed_restaurants()
        restaurants = await db.restaurants.find().to_list(100)
    return [Restaurant(**r) for r in restaurants]

@api_router.get("/restaurants/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    restaurant = await db.restaurants.find_one({"id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return Restaurant(**restaurant)

# Favorites Routes
@api_router.get("/favorites")
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"userId": current_user["id"]}).to_list(100)
    return favorites

@api_router.post("/favorites")
async def add_favorite(favorite_data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    # Check if already favorited
    existing = await db.favorites.find_one({
        "userId": current_user["id"],
        "restaurantId": favorite_data.restaurantId
    })
    if existing:
        return existing
    
    favorite = {
        "id": str(uuid.uuid4()),
        "userId": current_user["id"],
        "restaurantId": favorite_data.restaurantId,
        "createdAt": datetime.utcnow()
    }
    result = await db.favorites.insert_one(favorite) 
    favorite["_id"] = str(result.inserted_id)
    return favorite

@api_router.delete("/favorites/{restaurant_id}")
async def remove_favorite(restaurant_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.favorites.delete_one({
        "userId": current_user["id"],
        "restaurantId": restaurant_id
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Favorite removed"}

# Seed data function
async def seed_restaurants():
    sample_restaurants = [
        {
            "id": "1",
            "name": "Dishoom Covent Garden",
            "address": "12 Upper St Martin's Lane, London WC2H 9FB, United Kingdom",
            "rating": 4.4,
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            "cuisine": "Indian",
            "country": "UK",
            "description": "Dishoom Covent Garden offers the atmosphere of 1960s Bombay Indian cafes. The menu is inspired by classic Indian cuisine with a modern twist. It is a place for social gatherings and an evening out in the heart of London.",
            "menu": [
                {"id": "m1", "name": "House Black Daal", "price": "£7.90", "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"},
                {"id": "m2", "name": "Garlic Naan", "price": "£3.50", "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400"},
                {"id": "m3", "name": "Chicken Ruby", "price": "£11.90", "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400"}
            ]
        },
        {
            "id": "2",
            "name": "The Ivy Chelsea Garden",
            "address": "197 King's Road, Chelsea, London SW3 5EQ, United Kingdom",
            "rating": 4.3,
            "image": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
            "cuisine": "Italian",
            "country": "UK",
            "description": "The Ivy Chelsea Garden is an all-day British brasserie with a stunning garden terrace. Perfect for brunch, lunch, or dinner with friends and family.",
            "menu": [
                {"id": "m4", "name": "Truffle Risotto", "price": "£18.50", "image": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400"},
                {"id": "m5", "name": "Fish & Chips", "price": "£19.95", "image": "https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400"},
                {"id": "m6", "name": "Beef Burger", "price": "£16.75", "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
            ]
        },
        {
            "id": "3",
            "name": "Nobu London",
            "address": "19 Old Park Lane, London W1K 1LB, United Kingdom",
            "rating": 4.5,
            "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
            "cuisine": "Japanese",
            "country": "UK",
            "description": "Nobu London offers world-famous Japanese-Peruvian cuisine in a stylish setting. Known for its innovative dishes and exceptional service.",
            "menu": [
                {"id": "m7", "name": "Black Cod Miso", "price": "£36.00", "image": "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400"},
                {"id": "m8", "name": "Yellowtail Sashimi", "price": "£24.00", "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400"},
                {"id": "m9", "name": "Rock Shrimp Tempura", "price": "£28.00", "image": "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"}
            ]
        },
        {
            "id": "4",
            "name": "La Petite Maison",
            "address": "54 Brooks Mews, London W1K 4EG, United Kingdom",
            "rating": 4.6,
            "image": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800",
            "cuisine": "French",
            "country": "UK",
            "description": "La Petite Maison brings the flavors of Nice to London. Enjoy authentic French Mediterranean cuisine in an elegant setting.",
            "menu": [
                {"id": "m10", "name": "Burrata Salad", "price": "£22.00", "image": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400"},
                {"id": "m11", "name": "Sea Bass", "price": "£38.00", "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400"},
                {"id": "m12", "name": "Tarte Tatin", "price": "£14.00", "image": "https://images.unsplash.com/photo-1562007908-17c67e878c88?w=400"}
            ]
        },
        {
            "id": "5",
            "name": "Hakkasan Mayfair",
            "address": "17 Bruton Street, London W1J 6QB, United Kingdom",
            "rating": 4.4,
            "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
            "cuisine": "Chinese",
            "country": "UK",
            "description": "Hakkasan Mayfair offers modern Cantonese cuisine with innovative cocktails in a sleek, sophisticated atmosphere.",
            "menu": [
                {"id": "m13", "name": "Peking Duck", "price": "£78.00", "image": "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400"},
                {"id": "m14", "name": "Dim Sum Platter", "price": "£32.00", "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400"},
                {"id": "m15", "name": "Stir-fry Noodles", "price": "£24.00", "image": "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400"}
            ]
        },
        {
            "id": "6",
            "name": "Sabai Sabai Thai",
            "address": "25-27 Heddon Street, London W1B 4BH, United Kingdom",
            "rating": 4.2,
            "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            "cuisine": "Thai",
            "country": "UK",
            "description": "Sabai Sabai brings authentic Thai street food flavors to the heart of London. Fresh ingredients and traditional recipes.",
            "menu": [
                {"id": "m16", "name": "Pad Thai", "price": "£14.50", "image": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400"},
                {"id": "m17", "name": "Green Curry", "price": "£15.90", "image": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400"},
                {"id": "m18", "name": "Tom Yum Soup", "price": "£8.90", "image": "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400"}
            ]
        }
    ]
    
    await db.restaurants.insert_many(sample_restaurants)
    logger.info("Seeded restaurant data")

@api_router.get("/")
async def root():
    return {"message": "DineSpot API v1.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
