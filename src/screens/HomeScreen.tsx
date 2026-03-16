import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from '@/styles/screens/Home.scss';
import { useTestStore } from '@/store/useTestStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { count, increment, decrement, reset } = useTestStore();

  return (
    <View style={[styles['home-container'], { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        <Text style={styles['card-title']}>
          Zustand Demo 🐻
        </Text>
        <Text className="text-3xl font-bold text-center my-4 text-blue-600">
          {count}
        </Text>
        
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity 
            className="bg-red-100 p-3 rounded-full w-12 h-12 items-center justify-center"
            onPress={decrement}
          >
            <Text className="text-red-700 font-bold text-xl">-</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-100 p-3 rounded-full px-6 items-center justify-center"
            onPress={reset}
          >
            <Text className="text-gray-700 font-bold">Reset</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-green-100 p-3 rounded-full w-12 h-12 items-center justify-center"
            onPress={increment}
          >
            <Text className="text-green-700 font-bold text-xl">+</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 text-center text-xs">
          State is shared globally via Zustand
        </Text>
      </View>
      
      <View className="items-center mt-8">
        <Button 
          title="Go to Details" 
          onPress={() => navigation.navigate('Details', { id: 'MOVIE-001', title: 'Spider-Man: No Way Home' })} 
        />
      </View>
    </View>
  );
}
