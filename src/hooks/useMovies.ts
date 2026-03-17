import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movieService';
import { Slug } from '@/types/movies';

export const useInfiniteMovieList = (slug: Slug, limit = 24) => {
  return useInfiniteQuery({
    queryKey: ['movies-infinite', slug, limit],
    queryFn: ({ pageParam = 1 }) =>
      movieService.getListMovieBySlug({ slug, limit, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalItems, totalItemsPerPage } = lastPage.data.params.pagination;
      const totalPages = Math.ceil(totalItems / totalItemsPerPage);
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useMovieDetails = (slug: string) => {
  return useQuery({
    queryKey: ['movie', slug],
    queryFn: () => movieService.getDetailMovie(slug),
    enabled: !!slug,
  });
};

export const useMovieList = (slug: Slug, limit = 24, page = 1) => {
  return useQuery({
    queryKey: ['movies', slug, page, limit],
    queryFn: () => movieService.getListMovieBySlug({ slug, limit, page }),
  });
};

export const useSearchMovies = (keyword: string, limit = 24, page = 1) => {
  return useQuery({
    queryKey: ['search', keyword, page, limit],
    queryFn: () => movieService.searchMovie({ keyword, limit, page }),
    enabled: !!keyword,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => movieService.getCategories(),
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => movieService.getCountry(),
  });
};
