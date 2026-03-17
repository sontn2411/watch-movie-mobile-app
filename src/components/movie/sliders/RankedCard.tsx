import React from 'react';
import { View, Text } from 'react-native';
import { MovieItem } from '@/types/movies';
import BaseCard from '../common/BaseCard';

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
          fontSize: 80,
          fontWeight: '900',
          color: 'rgba(59,130,246,0.35)',
          lineHeight: 80,
          marginRight: -14,
          zIndex: 1,
        }}
      >
        {rank}
      </Text>
      <BaseCard
        movie={movie}
        imageDomain={imageDomain}
        width={128} // w-32
        aspectRatio={2 / 3}
        showEpisode={false}
        showQuality={false}
      />
    </View>
  );
};

export default React.memo(RankedCard);
