import React from 'react';
import { useMovieList } from '@/hooks/useMovies';
import MovieRow, { SliderVariant } from './MovieRow';
import { Slug } from '@/types/movies';

interface MovieCategoryRowProps {
  title: string;
  slug: Slug;
  limit?: number;
  variant?: SliderVariant;
}

const MovieCategoryRow: React.FC<MovieCategoryRowProps> = ({
  title,
  slug,
  limit = 10,
  variant = 'portrait',
}) => {
  const { data, isLoading } = useMovieList(slug, limit);

  return (
    <MovieRow
      title={title}
      slug={slug}
      movies={data?.data?.items || []}
      imageDomain={data?.data?.APP_DOMAIN_CDN_IMAGE || ''}
      loading={isLoading}
      variant={variant}
    />
  );
};

export default React.memo(MovieCategoryRow);
