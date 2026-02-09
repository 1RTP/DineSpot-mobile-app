import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../../src/components/RestaurantCard';
import BackButton from '../../src/components/BackButton';
import { useRestaurantStore } from '../../src/store/restaurantStore';
import { useAuthStore } from '../../src/store/authStore';
import PALETTE from '../../src/constants/colors';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();
  const { restaurants, favorites, toggleFavorite } = useRestaurantStore();

  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Favorites</Text>
        <View style={{ width: 44 }} />
      </View>

      {favoriteRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={PALETTE.textMuted} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Save restaurants to see them here</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(item.id, token)}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: PALETTE.textMuted,
    marginTop: 8,
  },
});
