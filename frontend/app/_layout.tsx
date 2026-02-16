import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';
import { useRestaurantStore } from '../src/store/restaurantStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import PALETTE from '../src/constants/colors';

export default function RootLayout() {
  const { loadUser, isLoading, user, isAuthenticated, token } = useAuthStore();
  const { loadFavorites } = useRestaurantStore();
  const [appReady, setAppReady] = useState(false);
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'WorkSans-Black': require('../assets/fonts/WorkSans-Black.ttf'),
        'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
        'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf'),
        'WorkSans-SemiBold': require('../assets/fonts/WorkSans-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };

    const init = async () => {
      await loadUser();
      setAppReady(true);
    };

    loadFonts();
    init();
  }, [loadUser]);

  useEffect(() => {
    if (appReady && fontsLoaded && !isLoading && !initialRedirectDone) {
      if (user && isAuthenticated) {
        if (token) {
          loadFavorites(token);
        }
        router.replace('/home');
      } else {
        router.replace('/welcome');
      }
      setInitialRedirectDone(true);
    }
  }, [appReady, fontsLoaded, isLoading, user, isAuthenticated, router, token, loadFavorites, initialRedirectDone]);

  if (!appReady || !fontsLoaded || isLoading) {
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
