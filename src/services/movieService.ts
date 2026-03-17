import { ResponseItem, ResponseMovie, Slug } from '@/types/movies';
import api from './api';
import movieApi from './movieApi';

export interface Movie {
  id: number;
  title: string;
  body: string;
}

interface PayloadMovieList {
  slug: Slug;
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  year?: string;
}

export const movieService = {
  getMovies: async (): Promise<Movie[]> => {
    // Using posts as a demo for movies
    const response = await api.get<Movie[]>('/posts?_limit=5');
    return response.data;
  },

  getListMovieBySlug: async ({
    slug,
    page = 1,
    limit = 24,
    category,
    country,
    year,
  }: PayloadMovieList): Promise<ResponseMovie> => {
    const response = await movieApi.get(
      `/danh-sach/${slug}?page=${page}&limit=${limit}&category=${category}&country=${country}&year=${year}`,
    );
    return response.data;
  },

  searchMovie: async ({
    keyword,
    page = 1,
    limit = 24,
  }: {
    keyword: string;
    page?: number;
    limit?: number;
  }): Promise<ResponseMovie> => {
    const response = await movieApi.get(
      `/tim-kiem/${keyword}?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getCategories: async () => {
    const response = await movieApi.get<ResponseItem>('/the-loai');
    return response.data;
  },

  getListMovieByCategory: async ({
    category,
    page = 1,
    limit = 24,
    country,
    year,
  }: {
    category: string;
    page?: number;
    limit?: number;
    country?: string;
    year?: string;
  }) => {
    const response = await movieApi.get<ResponseMovie>(
      `/the-loai/${category}?page=${page}&limit=${limit}&country=${country}&year=${year}`,
    );
    return response.data;
  },

  getCountry: async () => {
    const response = await movieApi.get<ResponseItem>('/quoc-gia');
    return response.data;
  },

  getListMovieByCountry: async ({
    country,
    page = 1,
    limit = 24,
    year,
  }: {
    country: string;
    page?: number;
    limit?: number;
    year?: string;
  }) => {
    const response = await movieApi.get<ResponseMovie>(
      `/quoc-gia/${country}?page=${page}&limit=${limit}&year=${year}`,
    );
    return response.data;
  },

  getDetailMovie: async (slug: string) => {
    const response = await movieApi.get<ResponseMovie>(`/phim/${slug}`);
    return response.data;
  },
};
