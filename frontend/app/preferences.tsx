import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../src/components/Header';
import TabBar from '../src/components/TabBar';
import PALETTE from '../src/constants/colors';

interface PreferenceItemProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function PreferenceItem({ icon, title, subtitle, onPress }: PreferenceItemProps) {
  return (
    <TouchableOpacity style={styles.preferenceItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.preferenceItemLeft}>
        <Ionicons name={icon as any} size={24} color={PALETTE.textPrimary} />
        <View style={styles.preferenceItemText}>
          <Text style={styles.preferenceTitle}>{title}</Text>
          <Text style={styles.preferenceSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PreferencesScreen() {
  const router = useRouter();
  // const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Header title="Preference" />

      <View style={styles.content}>
        <PreferenceItem
          icon="person-outline"
          title="Account Information"
          subtitle="Change your Account information"
          onPress={() => router.push('/edit-information')}
        />
        <PreferenceItem
          icon="eye-outline"
          title="Password"
          subtitle="Change your Password"
          onPress={() => router.push('/edit-password')}
        />
        <PreferenceItem
          icon="settings-outline"
          title="Theme Colour"
          subtitle="Change Your Theme Colour"
          onPress={() => {}}
        />
      </View>

      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  preferenceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceItemText: {
    marginLeft: 16,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: PALETTE.textSecondary,
  },
});
