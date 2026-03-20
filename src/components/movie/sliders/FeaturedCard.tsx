import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { MovieItem } from '@/types/movies';
import { Calendar } from 'lucide-react-native';
import BaseCard from '../common/BaseCard';
import { getResponsiveMultiplier } from '@/utils/device';

interface FeaturedCardProps {
  movie: MovieItem;
  imageDomain: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ movie, imageDomain }) => {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * getResponsiveMultiplier(0.55, 0.35);

  return (
    <BaseCard
      movie={movie}
      imageDomain={imageDomain}
      width={CARD_WIDTH}
      aspectRatio={3 / 4}
      gradientHeight="55%"
      showQuality={false}
      showEpisode={false}
      style={{ marginRight: 16 }}
    >
      <View className="absolute top-3 left-3 bg-primary/95 px-3 py-1 rounded-full flex-row items-center">
        <Calendar color="white" size={10} />
        <Text className="text-white text-[9px] font-black ml-1 uppercase tracking-wider">Sắp chiếu</Text>
      </View>
      <View className="absolute bottom-10 left-4 right-4">
         <Text className="text-muted text-[10px]" numberOfLines={1}>
          {movie.category?.map(c => c.name).slice(0, 2).join(' • ')}
        </Text>
      </View>
    </BaseCard>
  );
};

export default React.memo(FeaturedCard);
