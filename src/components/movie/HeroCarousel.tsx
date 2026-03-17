import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, Animated, Image } from 'react-native';
import Hero from './Hero';
import { MovieItem } from '@/types/movies';

const { width } = Dimensions.get('window');

interface HeroCarouselProps {
  movies: MovieItem[];
  imageDomain: string;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ movies, imageDomain }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Prefetch images for smoother loading
  useEffect(() => {
    if (movies && movies.length > 0 && imageDomain) {
      movies.forEach(movie => {
        const imageUrl = `${imageDomain}/uploads/movies/${movie.poster_url}`;
        Image.prefetch(imageUrl);
      });
    }
  }, [movies, imageDomain]);

  if (!movies || movies.length === 0) return null;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View className="relative">
      <FlatList
        data={movies}
        keyExtractor={item => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <Hero movie={item} imageDomain={imageDomain} />
        )}
      />

      {/* Pagination Dots */}
      <View className=" flex-row justify-center gap-2">
        {movies.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full ${
              activeIndex === index ? 'w-4 bg-primary' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default HeroCarousel;
