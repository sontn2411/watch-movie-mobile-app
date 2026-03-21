import React from 'react';
import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { CATEGORIES } from '@/constants/movieConfig';
import { useMovieList } from '@/hooks/useMovies';
import MovieCategoryRow from '@/components/movie/MovieCategoryRow';
import HeroCarousel from '@/components/movie/HeroCarousel';
import { FlashList } from '@shopify/flash-list';

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: heroData } = useMovieList('phim-moi', 5);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['movies'] });
    setRefreshing(false);
  }, [queryClient]);

  const featuredMovies = heroData?.data?.items || [];
  const imageDomain = heroData?.data?.APP_DOMAIN_CDN_IMAGE || '';

  const renderItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <MovieCategoryRow
      key={item.slug}
      title={item.title}
      slug={item.slug}
      variant={item.variant}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={CATEGORIES}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          featuredMovies.length > 0 ? (
            <HeroCarousel
              movies={featuredMovies}
              imageDomain={imageDomain}
            />
          ) : null
        }
        ListFooterComponent={<View style={{ height: 100 }} />} // eslint-disable-line react-native/no-inline-styles
        keyExtractor={item => item.slug}
      />
    </View>
  );
}
