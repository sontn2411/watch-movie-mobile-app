import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { id, title } = route.params;

  return (
    <View style={styles.container}>
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Details Screen
      </Text>
      <View className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full max-w-sm">
        <Text className="text-gray-500 text-sm mb-1">Item ID: {id}</Text>
        <Text className="text-xl font-semibold text-blue-600 mb-6">{title}</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
