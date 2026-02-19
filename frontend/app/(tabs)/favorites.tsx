import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackButton from '../../src/components/BackButton';
import { useAuthStore } from '../../src/store/authStore';
import { useRestaurantStore } from '../../src/store/restaurantStore';
import RestaurantCard from '../../src/components/RestaurantCard';
import PALETTE from '../../src/constants/colors';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { restaurants, favorites, toggleFavorite } = useRestaurantStore();

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.notLoggedIn}>
          <Ionicons name="bookmark-outline" size={64} color={PALETTE.textMuted} />
          <Text style={styles.notLoggedInText}>Please log in to see your favorites</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/welcome')}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={{ width: 44 }} />
      </View>

      {favoriteRestaurants.length === 0 ? (
        <View style={styles.notLoggedIn}>
          <Ionicons name="bookmark-outline" size={64} color={PALETTE.textMuted} />
          <Text style={styles.notLoggedInText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Save restaurants to see them here</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    // fontFamily: 'WorkSans-Medium',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notLoggedInText: {
    fontSize: 16,
    color: PALETTE.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
    // fontFamily: 'WorkSans-Medium',
  },
  loginButton: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  loginButtonText: {
    color: PALETTE.textLight,
    fontSize: 16,
    fontWeight: '600',
    // fontFamily: 'WorkSans-Medium',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: PALETTE.textMuted,
    marginTop: 8,
    // fontFamily: 'WorkSans-Medium',
  },
});
