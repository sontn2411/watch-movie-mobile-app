import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import { useInfiniteMovieList } from '@/hooks/useMovies';
import { FlashList } from '@shopify/flash-list';
import MovieCard from '@/components/movie/MovieCard';
import { COLORS } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieItem } from '@/types/movies';

const SeeMoreScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SeeMore'>>();
  const { slug } = route.params;
  const insets = useSafeAreaInsets();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteMovieList(slug);

  const movies = data?.pages.flatMap(page => page.data.items) || [];
  const imageDomain = data?.pages[0]?.data.APP_DOMAIN_CDN_IMAGE || '';

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-white text-center text-lg font-bold mb-2">
          Đã có lỗi xảy ra
        </Text>
        <Text className="text-textMuted text-center">
          Không thể tải danh sách phim. Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={movies}
        keyExtractor={(item: MovieItem) => item._id}
        renderItem={({ item }: { item: MovieItem }) => (
          <View style={{ flex: 1, paddingHorizontal: 5, paddingVertical: 10 }}>
            <MovieCard
              movie={item}
              imageDomain={imageDomain}
              width="100%"
              marginRight={0}
            />
          </View>
        )}
        numColumns={3}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View className="py-6">
            {isFetchingNextPage ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : null}
          </View>
        )}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: insets.bottom + 20,
        }}
      />
    </View>
  );
};

export default SeeMoreScreen;
