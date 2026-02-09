import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../src/components/Header';
import TabBar from '../src/components/TabBar';
import PALETTE from '../src/constants/colors';

export default function SandboxScreen() {
  return (
    <View style={styles.container}>
      <Header title="Sandbox" />
      <View style={styles.content}>
        {/* Empty sandbox page as requested */}
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
  content: {
    flex: 1,
  },
});
