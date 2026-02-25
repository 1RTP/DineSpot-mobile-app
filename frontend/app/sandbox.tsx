import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Header from '../src/components/Header';
import TabBar from '../src/components/TabBar';
import PALETTE from '../src/constants/colors';

export default function SandboxScreen() {
  return (
    <View style={styles.container}>
      <Header title="Sandbox" />
      <View style={styles.content}>
        <Image
          source={require('../assets/images/gopher-icon.png')}
          style={styles.image}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
});

// export default function SandboxScreen() {
//   return (
//     <View style={styles.container}>
//       <Header title="Sandbox" />
//       <View style={styles.content}>
//         {/* Empty sandbox page as requested */}
//       </View>
//       <TabBar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.background,
//   },
//   content: {
//     flex: 1,
//   },
// });
