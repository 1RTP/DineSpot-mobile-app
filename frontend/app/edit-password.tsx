import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../src/components/Header';
import InputField from '../src/components/InputField';
import PrimaryButton from '../src/components/PrimaryButton';
import TabBar from '../src/components/TabBar';
import { useAuthStore } from '../src/store/authStore';
import PALETTE from '../src/constants/colors';

export default function EditPasswordScreen() {
  const router = useRouter();
  const { changePassword } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const success = await changePassword(currentPassword, newPassword);
    setLoading(false);
    if (success) {
      Alert.alert('Success', 'Your password has been updated', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit password" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <InputField
              placeholder="CURRENT PASSWORD"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              icon="lock-closed-outline"
              isPassword
            />
            <InputField
              placeholder="NEW PASSWORD"
              value={newPassword}
              onChangeText={setNewPassword}
              icon="lock-closed-outline"
              isPassword
            />
            <InputField
              placeholder="CONFIRM PASSWORD"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon="lock-closed-outline"
              isPassword
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
