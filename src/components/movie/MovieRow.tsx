import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MovieCard from './MovieCard';
import LandscapeCard from './sliders/LandscapeCard';
import RankedCard from './sliders/RankedCard';
import FeaturedCard from './sliders/FeaturedCard';
import { FlashList } from '@shopify/flash-list';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Slug } from '@/types/movies';
import { Skeleton } from '../common/Skeleton';
import { isPad, getResponsiveWidth } from '@/utils/device';
import { useTheme } from '@/hooks/useTheme';

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
  const { colors } = useTheme();

  if (loading) {
    // ... skeleton logic ...
    return (
      <View className="mb-8">
        <View className="px-6 mb-4">
          <Skeleton width={160} height={24} borderRadius={12} />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i} className="mr-4">
              <Skeleton 
                width={getResponsiveWidth(128, 180)} 
                height={getResponsiveWidth(192, 270)} 
                borderRadius={16} 
              />
              <View className="mt-2">
                <Skeleton width={100} height={12} borderRadius={4} className="mb-1" />
                <Skeleton width={60} height={10} borderRadius={4} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!movies || movies.length === 0) return null;

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    switch (variant) {
      case 'landscape':
        return (
          <LandscapeCard
            key={item._id}
            movie={item}
            imageDomain={imageDomain}
          />
        );
      case 'ranked':
        return (
          <RankedCard
            key={item._id}
            movie={item}
            imageDomain={imageDomain}
            rank={index + 1}
          />
        );
      case 'featured':
        return (
          <FeaturedCard
            key={item._id}
            movie={item}
            imageDomain={imageDomain}
          />
        );
      default:
        return (
          <MovieCard
            key={item._id}
            movie={item}
            imageDomain={imageDomain}
          />
        );
    }
  };

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text className="text-lg font-bold text-text tracking-tight">{title}</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => navigation.navigate('SeeMore', { title, slug })}
        >
          <Text className="text-primary text-xs font-black uppercase tracking-widest mr-1">
            Xem thêm
          </Text>
          <ChevronRight color={colors.primary} size={14} />
        </TouchableOpacity>
      </View>

      <View style={{ height: variant === 'landscape' ? 180 : 260, width: '100%' }}>
        <FlashList
          data={movies}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }} // eslint-disable-line react-native/no-inline-styles
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

export default React.memo(MovieRow);
