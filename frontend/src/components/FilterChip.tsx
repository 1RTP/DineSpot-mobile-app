import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PALETTE from '../constants/colors';

interface FilterChipProps {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  isActive?: boolean;
}

export default function FilterChip({ label, icon, onPress, isActive }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
      <Ionicons name="chevron-down" size={16} color={PALETTE.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  chipActive: {
    borderColor: PALETTE.primary,
    backgroundColor: PALETTE.background,
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: PALETTE.textPrimary,
    marginRight: 4,
    fontWeight: '500',
  },
  labelActive: {
    color: PALETTE.primary,
  },
});
