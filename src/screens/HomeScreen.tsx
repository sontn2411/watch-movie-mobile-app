import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/common/Button';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import styles from '@/styles/screens/Home.scss';
import { useTestStore } from '@/store/useTestStore';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movieService';
import { APP_CONFIG } from '@/constants/config';
import Icon from '@/components/common/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { count, increment, decrement, reset } = useTestStore();

  const {
    data: movies,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['movies'],
    queryFn: movieService.getMovies,
  });

  return (
    <View
      style={[
        styles['home-container'],
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <Icon name="home" className="text-red-500 w-10 h-10" />
      <View className="mb-4">
        <Text className="text-center text-xs text-gray-400">
          Env: {APP_CONFIG.ENVIRONMENT} | API: {APP_CONFIG.API_URL}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles['card-title']}>Zustand Demo 🐻</Text>
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
      </View>

      <View className="mt-6 w-full px-4">
        <Text className="text-xl font-bold mb-3 text-gray-800">
          API Demo (React Query) 🌐
        </Text>

        {isLoading ? (
          <Text className="text-gray-500 italic">Finding movies...</Text>
        ) : isError ? (
          <View>
            <Text className="text-red-500">Error fetching data</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-red-500 p-2 rounded mt-2"
            >
              <Text className="text-white text-center">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {movies?.map(movie => (
              <TouchableOpacity
                key={movie.id}
                className="p-4 border-b border-gray-50 active:bg-blue-50"
                onPress={() =>
                  navigation.navigate('Details', {
                    id: String(movie.id),
                    title: movie.title,
                  })
                }
              >
                <Text className="font-semibold text-gray-800" numberOfLines={1}>
                  🎬 {movie.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="items-center mt-auto mb-4">
        <Button
          title="Go to Manual Details"
          onPress={() =>
            navigation.navigate('Details', {
              id: 'MOVIE-001',
              title: 'Spider-Man: No Way Home',
            })
          }
        />
      </View>
    </View>
  );
}
