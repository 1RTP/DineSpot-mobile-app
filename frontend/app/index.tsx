import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Logo from '../src/components/Logo';
import PALETTE from '../src/constants/colors';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Logo size="large" />
      <Text style={styles.version}>Version 1.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.splashBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: PALETTE.textMuted,
    fontSize: 14,
  },
});
