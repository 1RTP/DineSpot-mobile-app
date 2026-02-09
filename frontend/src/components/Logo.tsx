import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const dimensions = {
    small: { width: 80, height: 80 },
    medium: { width: 140, height: 140 },
    large: { width: 180, height: 180 },
  };

  const { width, height } = dimensions[size];

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={[styles.image, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
