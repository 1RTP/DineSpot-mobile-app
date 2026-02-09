import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PALETTE from '../src/constants/colors';

export default function RootLayout() {
  const { loadUser, isLoading, user, isAuthenticated } = useAuthStore();
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await loadUser();
      setAppReady(true);
    };
    init();
  }, [loadUser]);

  useEffect(() => {
    if (appReady && !isLoading) {
      if (user && isAuthenticated) {
        router.replace('/home');
      } else {
        router.replace('/welcome');
      }
    }
  }, [appReady, isLoading, user, isAuthenticated, router]);

  if (!appReady || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PALETTE.accent} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: PALETTE.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="edit-information" />
        <Stack.Screen name="edit-password" />
        <Stack.Screen name="sandbox" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: PALETTE.splashBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
