import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PALETTE from '../constants/colors';

type IconName = 'person-outline' | 'mail-outline' | 'lock-closed-outline';

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: IconName;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}

export default function InputField({
  placeholder,
  value,
  onChangeText,
  icon,
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const renderIcon = () => {
    if (!icon) return null;
    return <Ionicons name={icon} size={22} color={PALETTE.textMuted} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={PALETTE.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color={PALETTE.textMuted}
          />
        </TouchableOpacity>
      )}
      {!isPassword && editable && (
        <View style={styles.editIcon}>
          <MaterialCommunityIcons name="pencil-outline" size={20} color={PALETTE.textMuted} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: PALETTE.textPrimary,
    letterSpacing: 1,
  },
  eyeButton: {
    padding: 4,
  },
  editIcon: {
    padding: 4,
  },
});
