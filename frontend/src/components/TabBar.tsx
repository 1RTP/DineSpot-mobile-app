import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import PALETTE from '../constants/colors';

type TabIconName = 'home' | 'search' | 'bookmark' | 'person';
type TabIconOutlineName = 'home-outline' | 'search-outline' | 'bookmark-outline' | 'person-outline';

interface Tab {
  name: string;
  label: string;
  icon: TabIconName;
  iconOutline: TabIconOutlineName;
  route: string;
}

const tabs: Tab[] = [
  { name: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline', route: '/(tabs)/home' },
  { name: 'search', label: 'Search', icon: 'search', iconOutline: 'search-outline', route: '/(tabs)/search' },
  { name: 'favorites', label: 'Favorites', icon: 'bookmark', iconOutline: 'bookmark-outline', route: '/(tabs)/favorites' },
  { name: 'profile', label: 'Profile', icon: 'person', iconOutline: 'person-outline', route: '/(tabs)/profile' },
];

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname.includes(route.replace('/(tabs)', ''));
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={active ? tab.icon : tab.iconOutline}
              size={24}
              color={active ? PALETTE.textPrimary : PALETTE.textSecondary}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: PALETTE.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: PALETTE.tabBarBorder,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    color: PALETTE.textSecondary,
  },
  labelActive: {
    color: PALETTE.textPrimary,
    fontWeight: '500',
  },
});
