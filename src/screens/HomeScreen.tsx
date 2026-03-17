import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { CATEGORIES } from '@/constants/movieConfig';
import { useMovieList } from '@/hooks/useMovies';
import MovieCategoryRow from '@/components/movie/MovieCategoryRow';
import HeroCarousel from '@/components/movie/HeroCarousel';
import { movieService } from '@/services/movieService';
import { Search, Bell } from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: heroData } = useMovieList('phim-moi', 5);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['movies'] });
    setRefreshing(false);
  }, [queryClient]);

  const featuredMovies = heroData?.data?.items || [];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22C55E"
          />
        }
      >
        {featuredMovies.length > 0 && (
          <HeroCarousel
            movies={featuredMovies}
            imageDomain={heroData?.data?.APP_DOMAIN_CDN_IMAGE || ''}
          />
        )}

        <View className="mt-4">
          {CATEGORIES.map(category => (
            <MovieCategoryRow
              key={category.slug}
              title={category.title}
              slug={category.slug}
              variant={category.variant}
            />
          ))}
        </View>

        {/* Extra spacing for bottom tabs */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
