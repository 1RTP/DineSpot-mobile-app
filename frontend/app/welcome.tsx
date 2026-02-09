import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../src/components/Logo';
import PrimaryButton from '../src/components/PrimaryButton';
import BackButton from '../src/components/BackButton';
import TabBar from '../src/components/TabBar';
import PALETTE from '../src/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.content}>
        <Logo size="large" />
        
        <Text style={styles.welcomeTitle}>Welcome to</Text>
        <Text style={styles.appName}>DineSpot</Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Log in"
            onPress={() => router.push('/login')}
            style={styles.loginButton}
          />
          <PrimaryButton
            title="Sign up"
            onPress={() => router.push('/register')}
            variant="secondary"
            style={styles.signupButton}
          />
        </View>
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
  header: {
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: PALETTE.textPrimary,
    marginTop: 40,
    fontStyle: 'italic',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 60,
  },
  loginButton: {
    marginBottom: 16,
  },
  signupButton: {},
});
