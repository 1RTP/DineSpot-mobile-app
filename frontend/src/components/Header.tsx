import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import PALETTE from '../constants/colors';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.leftContainer}>
        {showBackButton && <BackButton onPress={onBackPress} />}
      </View>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: PALETTE.background,
  },
  leftContainer: {
    width: 50,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  rightContainer: {
    width: 50,
    alignItems: 'flex-end',
  },
});
