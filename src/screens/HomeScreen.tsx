import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import styles from '@/styles/screens/HomeScreen.scss';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles['home-container'], { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        <Text style={styles['card-title']}>
          SCSS is Working! 🎨
        </Text>
        <Text style={styles['card-text']}>
          You can use nested SCSS styles right here.
        </Text>
      </View>
      
      <View className="mt-8 bg-blue-100 p-4 rounded-xl items-center border border-blue-200">
        <Text className="text-blue-900 font-bold">Tailwind still works too! 🚀</Text>
      </View>

      <View className="items-center mt-4">
        <Button title="Click Me" onPress={() => console.log('Button pressed')} />
      </View>
    </View>
  );
}

