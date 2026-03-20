import React from 'react';
import { useWindowDimensions } from 'react-native';
import { MovieItem } from '@/types/movies';
import BaseCard from '../common/BaseCard';
import { getResponsiveMultiplier } from '@/utils/device';

interface LandscapeCardProps {
  movie: MovieItem;
  imageDomain: string;
}

const LandscapeCard: React.FC<LandscapeCardProps> = ({ movie, imageDomain }) => {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width * getResponsiveMultiplier(0.75, 0.45);

  return (
    <BaseCard
      movie={movie}
      imageDomain={imageDomain}
      width={CARD_WIDTH}
      aspectRatio={16 / 9}
      gradientHeight="70%"
      showEpisode={true}
      showQuality={true}
      activeOpacity={0.85}
      style={{ marginRight: 16 }}
    />
  );
};

export default React.memo(LandscapeCard);
