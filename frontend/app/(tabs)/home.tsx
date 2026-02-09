import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Text, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RestaurantCard from '../../src/components/RestaurantCard';
import FilterChip from '../../src/components/FilterChip';
import { useRestaurantStore } from '../../src/store/restaurantStore';
import { useAuthStore } from '../../src/store/authStore';
import { COUNTRY_FLAGS } from '../../src/constants/flags';
import { CUISINE_ICONS } from '../../src/constants/cuisines';
import { RATING_ICON } from '../../src/constants/icons';
import PALETTE from '../../src/constants/colors';

const CUISINES = ['All', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'French', 'Thai'];
const COUNTRIES = ['All', 'UK', 'USA', 'France', 'Italy', 'Japan', 'India', 'Thailand'];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();
  const { favorites, filters, setFilters, toggleFavorite, fetchRestaurants, getFilteredRestaurants } = useRestaurantStore();
  const [searchText, setSearchText] = useState('');
  const [showCuisineModal, setShowCuisineModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    setFilters({ search: searchText });
  }, [searchText, setFilters]);

  const filteredRestaurants = getFilteredRestaurants();
  const selectedCuisine = filters.cuisine || 'All';
  const selectedCountry = filters.country || 'All';
  const ratingLabel = `${filters.ratingMin || 4} - ${filters.ratingMax || 5}`;

  const renderCuisineModal = ( 
    visible: boolean,
    onClose: () => void,
    selected: string 
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Cuisine</Text>
          {CUISINES.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.modalOption,
                selected === option && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setFilters({ cuisine: option === 'All' ? '' : option });
                onClose();
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {CUISINE_ICONS[option] && (
                  <Image
                    source={CUISINE_ICONS[option]}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={[
                    styles.modalOptionText,
                    selected === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderCountryModal = (
    visible: boolean,
    onClose: () => void,
    selected: string
  ) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Country</Text>
          {COUNTRIES.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.modalOption,
                selected === option && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setFilters({ country: option === 'All' ? '' : option });
                onClose();
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {COUNTRY_FLAGS[option] && (
                  <Image
                    source={COUNTRY_FLAGS[option]}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={[
                    styles.modalOptionText,
                    selected === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color={PALETTE.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={PALETTE.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/sandbox')}>
          <Ionicons name="options-outline" size={22} color={PALETTE.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
          <FilterChip
            label={selectedCuisine}
            icon={
              <Image
                source={CUISINE_ICONS[selectedCuisine]}
                style={{ width: 20, height: 20, marginRight: 6 }}
                resizeMode="contain"
              />
            }
            onPress={() => setShowCuisineModal(true)}
          />
          <FilterChip
            label={ratingLabel}
            icon={
              <Image
                source={RATING_ICON}
                style={{ width: 20, height: 20, marginRight: 6 }}
                resizeMode="contain"
              />
            }
            onPress={() => setShowRatingModal(true)}
          />
          <FilterChip
            label={selectedCountry}
            icon={
              <Image
                source={COUNTRY_FLAGS[selectedCountry]}
                style={{ width: 20, height: 20, marginRight: 6 }}
                resizeMode="contain"
              />
            }
            onPress={() => setShowCountryModal(true)}
          />
        </ScrollView>
      </View>

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id, token)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Modals */}
      {renderCuisineModal(
        showCuisineModal,
        () => setShowCuisineModal(false),
        filters.cuisine || 'All'
      )}
      {renderCountryModal(
        showCountryModal,
        () => setShowCountryModal(false),
        filters.country || 'All'
      )}

      <Modal visible={showRatingModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowRatingModal(false)} activeOpacity={1}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Rating</Text>
            {['1 - 2', '2 - 3', '3 - 4', '4 - 5'].map((range) => {
              const [min, max] = range.split(' - ').map(Number);
              const isSelected = filters.ratingMin === min && filters.ratingMax === max;
              return (
                <TouchableOpacity
                  key={range}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    setFilters({ ratingMin: min, ratingMax: max });
                    setShowRatingModal(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={RATING_ICON}
                      style={{ width: 20, height: 20, marginRight: 8 }}
                      resizeMode="contain"
                    />
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {range}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputWrapper: {
    flex: 1,
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
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PALETTE.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersContainer: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 16, 
    flex: 1, 
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: PALETTE.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: PALETTE.inputBackground,
  },
  modalOptionText: {
    fontSize: 16,
    color: PALETTE.textPrimary,
  },
  modalOptionTextSelected: {
    fontWeight: '600',
  },
});
