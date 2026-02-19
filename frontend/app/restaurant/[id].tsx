import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../../src/components/BackButton';
import TabBar from '../../src/components/TabBar';
import { useRestaurantStore } from '../../src/store/restaurantStore';
import { useAuthStore } from '../../src/store/authStore';
import PALETTE from '../../src/constants/colors';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuthStore(); 
  const { restaurants, favorites, toggleFavorite } = useRestaurantStore();

  const restaurant = restaurants.find((r) => r.id === id);
  const isFavorite = favorites.includes(id || '');

  if (!restaurant) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BackButton />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Restaurant not found</Text>
        </View>
        <TabBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: restaurant.image }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={[styles.headerOverlay, { paddingTop: insets.top + 10 }]}>
            <BackButton />
            {isAuthenticated && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(restaurant.id, token)}
              >
                <Ionicons
                  name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isFavorite ? PALETTE.primary : PALETTE.textPrimary}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.titleOverlay}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color={PALETTE.accent} />
              <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>About us</Text>
          <Text style={styles.description}>
            {restaurant.description || `${restaurant.name} offers the atmosphere of a classic dining experience. The menu is inspired by ${restaurant.cuisine} cuisine with a modern twist. It is a place for social gatherings and an evening out in the heart of the city.`}
          </Text>

          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.address}>{restaurant.address}</Text>

          <Text style={styles.sectionTitle}>Menu</Text>
          {(restaurant.menu || []).map((item) => (
            <View key={item.id} style={styles.menuItem}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.menuItemImage}
                  resizeMode="cover"
                />
              )}
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>{item.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: PALETTE.textSecondary,
    // fontFamily: 'WorkSans-Medium',
  },
  imageContainer: {
    position: 'relative',
    height: 280,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PALETTE.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: PALETTE.textLight,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    flex: 1,
    // fontFamily: 'WorkSans-Bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    color: PALETTE.textLight,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    // fontFamily: 'WorkSans-Bold',
  },
  description: {
    fontSize: 14,
    color: PALETTE.textSecondary,
    lineHeight: 22,
    // fontFamily: 'WorkSans-Medium',
  },
  address: {
    fontSize: 14,
    color: PALETTE.textPrimary,
    lineHeight: 22,
    // fontFamily: 'WorkSans-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.divider,
    paddingBottom: 16,
  },
  menuItemImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    marginBottom: 4,
    // fontFamily: 'WorkSans-Medium',
  },
  menuItemPrice: {
    fontSize: 14,
    color: PALETTE.textSecondary,
    // fontFamily: 'WorkSans-Medium',
  },
});
