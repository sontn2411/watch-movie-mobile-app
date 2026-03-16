import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import { COLORS } from '@/constants/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View className="bg-blue-100 p-4 m-4 rounded-xl items-center justify-center border border-blue-200">
        <Text className="text-xl font-bold text-blue-900">
          Folder Structure Ready! 🚀
        </Text>
        <Text className="text-base text-gray-700 mt-2 text-center">
          Path aliases are working. This is HomeScreen loaded via src/App.tsx.
        </Text>
      </View>
      <View className="items-center">
        <Button title="Click Me" onPress={() => console.log('Button pressed')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
