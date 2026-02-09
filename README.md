# DineSpot - Restaurant Discovery App

Мобільний застосунок для пошуку та збереження улюблених ресторанів.

## 🏗️ Архітектура

```
app/
├── backend/          # FastAPI сервер
│   ├── server.py     # Основний API файл
│   ├── .env          # Змінні середовища бекенду
│   └── requirements.txt
├── frontend/         # Expo React Native застосунок
│   ├── app/          # Екрани (expo-router)
│   ├── src/          # Компоненти, сторінки, утиліти
│   ├── assets/       # Зображення, шрифти
│   └── .env          # Змінні середовища фронтенду
└── README.md
```

## 🔧 Налаштування

### Backend (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="dinespot_db"
```

### Frontend (.env)
```env
EXPO_PUBLIC_BACKEND_URL=https://your-domain.com
```

**Важливо:** Не змінюйте `EXPO_PACKAGER_HOSTNAME` та `EXPO_PACKAGER_PROXY_URL` - вони потрібні для роботи preview.

## 📦 Встановлення

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## 🗄️ База даних (MongoDB)

### Колекції:

1. **users** - Користувачі
```json
{
  "id": "uuid",
  "fullName": "Ім'я Прізвище",
  "email": "email@example.com",
  "password": "hashed_password",
  "token": "auth_token",
  "avatar": "base64_image_or_null",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

2. **restaurants** - Ресторани
```json
{
  "id": "1",
  "name": "Restaurant Name",
  "address": "Address",
  "rating": 4.5,
  "image": "https://...",
  "cuisine": "Italian",
  "country": "UK",
  "description": "...",
  "menu": [{"id": "m1", "name": "Dish", "price": "£10", "image": "..."}]
}
```

3. **favorites** - Улюблені
```json
{
  "id": "uuid",
  "userId": "user_uuid",
  "restaurantId": "restaurant_id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🔌 API Endpoints

### Автентифікація
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід
- `PUT /api/auth/profile` - Оновити профіль
- `PUT /api/auth/avatar` - Оновити аватар
- `PUT /api/auth/password` - Змінити пароль

### Ресторани
- `GET /api/restaurants` - Список ресторанів
- `GET /api/restaurants/{id}` - Деталі ресторану

### Улюблені
- `GET /api/favorites` - Список улюблених
- `POST /api/favorites` - Додати до улюблених
- `DELETE /api/favorites/{restaurant_id}` - Видалити з улюблених

## 📱 Екрани

1. **Splash** - Завантаження з логотипом
2. **Welcome** - Вітання, кнопки Log in / Sign up
3. **Login** - Вхід в акаунт
4. **Register** - Реєстрація
5. **Home** - Пошук, фільтри, картки ресторанів
6. **Restaurant Detail** - Деталі ресторану з меню
7. **Profile** - Профіль користувача
8. **Preferences** - Налаштування
9. **Edit Information** - Редагування профілю
10. **Edit Password** - Зміна пароля
11. **Sandbox** - Порожня тестова сторінка
12. **Favorites** - Улюблені ресторани

## 🔐 Автентифікація

Застосунок використовує JWT-подібну автентифікацію:
1. При реєстрації/вході генерується унікальний токен
2. Токен зберігається в AsyncStorage
3. Токен передається в заголовку `Authorization: Bearer {token}`

## 📝 Примітки

- Аватари зберігаються в форматі base64 в MongoDB
- Фільтри: кухня, рейтинг, країна
- Tab-bar: Home, Search, Favorites, Profile
