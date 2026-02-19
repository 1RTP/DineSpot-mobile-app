import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../../src/components/RestaurantCard';
import { useRestaurantStore } from '../../src/store/restaurantStore';
import { useAuthStore } from '../../src/store/authStore';
import PALETTE from '../../src/constants/colors';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuthStore();
  const { restaurants, favorites, toggleFavorite } = useRestaurantStore();
  const [searchText, setSearchText] = useState('');

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
    r.address.toLowerCase().includes(searchText.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color={PALETTE.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={PALETTE.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={PALETTE.textMuted}
              onPress={() => setSearchText('')}
            />
          )}
        </View>
      </View>

      {filteredRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={PALETTE.textMuted} />
          <Text style={styles.emptyText}>
            {searchText ? 'No restaurants found' : 'Start typing to search'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={
                isAuthenticated ? () => toggleFavorite(item.id, token) : undefined
              }
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: PALETTE.textPrimary,
    // fontFamily: 'WorkSans-Medium',
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
    fontSize: 16,
    color: PALETTE.textMuted,
    marginTop: 16,
    // fontFamily: 'WorkSans-Medium',
  },
});
