import React from 'react';
import { DimensionValue } from 'react-native';
import { MovieItem } from '@/types/movies';
import BaseCard from './common/BaseCard';
import { getResponsiveWidth } from '@/utils/device';

interface MovieCardProps {
  movie: MovieItem;
  imageDomain: string;
  width?: DimensionValue;
  marginRight?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  imageDomain, 
  width = getResponsiveWidth(128, 180), 
  marginRight = 16 
}) => {
  return (
    <BaseCard
      movie={movie}
      imageDomain={imageDomain}
      width={width}
      showPlayButton={true}
      style={{ marginRight }}
    />
  );
};

export default React.memo(MovieCard);
