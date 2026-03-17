import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MovieCard from './MovieCard';
import LandscapeCard from './sliders/LandscapeCard';
import RankedCard from './sliders/RankedCard';
import FeaturedCard from './sliders/FeaturedCard';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Slug } from '@/types/movies';

export type SliderVariant = 'portrait' | 'landscape' | 'ranked' | 'featured';

interface MovieRowProps {
  title: string;
  slug: Slug;
  movies: any[];
  imageDomain: string;
  loading?: boolean;
  variant?: SliderVariant;
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  slug,
  movies,
  imageDomain,
  loading,
  variant = 'portrait',
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (loading) {
    const skeletonAspect =
      variant === 'landscape'
        ? 'aspect-video'
        : variant === 'featured'
          ? 'aspect-[3/4]'
          : 'aspect-[2/3]';
    const skeletonW =
      variant === 'landscape' ? 256 : variant === 'featured' ? 176 : 128; // Equivalent to w-64, w-44, w-32
    return (
      <View className="mb-8 px-4">
        <View className="h-6 w-40 bg-white/5 rounded-full mb-4" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map(i => (
            <View
              key={i}
              style={{ width: skeletonW }}
              className={`mr-4 ${skeletonAspect} bg-white/5 rounded-2xl`}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text className="text-lg font-bold text-white tracking-tight">{title}</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.navigate('SeeMore', { title, slug })}
        >
          <Text className="text-primary text-xs font-black uppercase tracking-widest mr-1">
            Xem thêm
          </Text>
          <ChevronRight color={COLORS.primary} size={14} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {movies.map((movie, index) => {
          switch (variant) {
            case 'landscape':
              return (
                <LandscapeCard
                  key={movie._id}
                  movie={movie}
                  imageDomain={imageDomain}
                />
              );
            case 'ranked':
              return (
                <RankedCard
                  key={movie._id}
                  movie={movie}
                  imageDomain={imageDomain}
                  rank={index + 1}
                />
              );
            case 'featured':
              return (
                <FeaturedCard
                  key={movie._id}
                  movie={movie}
                  imageDomain={imageDomain}
                />
              );
            default:
              return (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  imageDomain={imageDomain}
                />
              );
          }
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(MovieRow);
