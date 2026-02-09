import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../src/components/Header';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';
import TabBar from '../src/components/TabBar';
import { useAuthStore } from '../src/store/authStore';
import PALETTE from '../src/constants/colors';

export default function EditInformationScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const success = await updateProfile({ fullName, email });
    setLoading(false);
    if (success) {
      Alert.alert('Success', 'Your information has been updated', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to update information');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Information" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <InputField
              placeholder="FULL NAME"
              value={fullName}
              onChangeText={setFullName}
              icon="person-outline"
              autoCapitalize="words"
            />
            <InputField
              placeholder="EMAIL"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PrimaryButton
              title="SAVE CHANGES"
              onPress={handleSave}
              loading={loading}
              style={styles.button}
            />
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
  form: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  button: {
    marginTop: 16,
  },
});
