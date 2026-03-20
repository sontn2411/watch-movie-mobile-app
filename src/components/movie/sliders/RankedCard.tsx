import React from 'react';
import { View, Text } from 'react-native';
import { MovieItem } from '@/types/movies';
import BaseCard from '../common/BaseCard';
import { isPad, getResponsiveWidth } from '@/utils/device';

interface RankedCardProps {
  movie: MovieItem;
  imageDomain: string;
  rank: number;
}

const RankedCard: React.FC<RankedCardProps> = ({ movie, imageDomain, rank }) => {
  return (
    <View className="mr-4 flex-row items-end">
      {/* Huge Rank Number */}
      <Text
        style={{
          fontSize: isPad ? 120 : 80,
          fontWeight: '900',
          color: 'rgba(59,130,246,0.35)',
          lineHeight: isPad ? 110 : 80,
          marginRight: isPad ? -20 : -14,
          zIndex: 1,
        }}
      >
        {rank}
      </Text>
      <BaseCard
        movie={movie}
        imageDomain={imageDomain}
        width={getResponsiveWidth(128, 180)}
        aspectRatio={2 / 3}
        showEpisode={false}
        showQuality={false}
      />
    </View>
  );
};

export default React.memo(RankedCard);
