import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BackButton from '../../src/components/BackButton';
import { useAuthStore } from '../../src/store/authStore';
import PALETTE from '../../src/constants/colors';

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon as any} size={24} color={PALETTE.textPrimary} />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={PALETTE.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, isAuthenticated, updateAvatar } = useAuthStore();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // On web, just logout directly
      const confirm = window.confirm('Are you sure you want to logout?');
      if (confirm) {
        await logout();
        router.replace('/welcome');
      }
    } else {
      // On mobile, use Alert
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/welcome');
          },
        },
      ]);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setUploadingImage(true);
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const success = await updateAvatar(base64Image);
        setUploadingImage(false);
        
        if (!success) {
          Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        }
      }
    } catch (error) {
      setUploadingImage(false);
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.notLoggedIn}>
          <Ionicons name="person-outline" size={64} color={PALETTE.textMuted} />
          <Text style={styles.notLoggedInText}>Please log in to see your profile</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/welcome')}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage} activeOpacity={0.8}>
          {uploadingImage ? (
            <View style={styles.avatarPlaceholder}>
              <ActivityIndicator size="large" color={PALETTE.primary} />
            </View>
          ) : user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color={PALETTE.textMuted} />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color={PALETTE.textLight} />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
      </View>

      <View style={styles.menuContainer}>
        <MenuItem
          icon="bookmark-outline"
          label="Favorite restaurants"
          onPress={() => router.push('/(tabs)/favorites')}
        />
        <MenuItem
          icon="settings-outline"
          label="Preferences"
          onPress={() => router.push('/preferences')}
        />
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="log-out-outline" size={24} color={PALETTE.textPrimary} />
            <Text style={styles.menuItemLabel}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    // fontFamily: 'WorkSans-Medium',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PALETTE.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PALETTE.border,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PALETTE.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: PALETTE.textPrimary,
    marginBottom: 4,
    // fontFamily: 'WorkSans-Medium',
  },
  userEmail: {
    fontSize: 14,
    color: PALETTE.textSecondary,
    // fontFamily: 'WorkSans-Medium',
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    fontFamily: 'WorkSans-Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    color: PALETTE.textPrimary,
    marginLeft: 16,
    // fontFamily: 'WorkSans-Medium',
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notLoggedInText: {
    fontSize: 16,
    color: PALETTE.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    // fontFamily: 'WorkSans-Medium',
  },
  loginButton: {
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  loginButtonText: {
    color: PALETTE.textLight,
    fontSize: 16,
    fontWeight: '600',
    // fontFamily: 'WorkSans-Medium',
  },
});
