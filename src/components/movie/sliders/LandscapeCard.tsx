import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MovieItem } from '@/types/movies';
import BaseCard from '../common/BaseCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

interface LandscapeCardProps {
  movie: MovieItem;
  imageDomain: string;
}

const LandscapeCard: React.FC<LandscapeCardProps> = ({ movie, imageDomain }) => {
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
