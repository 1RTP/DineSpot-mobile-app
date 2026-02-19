import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../src/components/BackButton';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';
import TabBar from '../src/components/TabBar';
import { useAuthStore } from '../src/store/authStore';
import PALETTE from '../src/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const success = await register(fullName, email, password);
    setLoading(false);
    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <BackButton onPress={() => router.back()} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Create your</Text>
            <Text style={styles.subtitle}>Account</Text>

            <View style={styles.form}>
              <InputField
                placeholder="FULL NAME"
                value={fullName}
                onChangeText={setFullName}
                icon="person-outline"
                autoCapitalize="words"
              />
              <InputField
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                placeholder="PASSWORD"
                value={password}
                onChangeText={setPassword}
                icon="lock-closed-outline"
                isPassword
              />

              <PrimaryButton
                title="Register"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
              />

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already Have An Account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    // fontStyle: 'italic',
    // fontFamily: 'WorkSans-Medium',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    marginBottom: 40,
    // fontStyle: 'italic',
    // fontFamily: 'WorkSans-Medium',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 8,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: PALETTE.textSecondary,
    fontSize: 14,
    // fontFamily: 'WorkSans-Medium',
  },
  loginLink: {
    color: PALETTE.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    // fontFamily: 'WorkSans-Medium',
  },
});
