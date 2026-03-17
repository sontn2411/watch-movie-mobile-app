import { ResponseItem, ResponseMovie, ResponseMovieDetail, Slug } from '@/types/movies';
import httpClient from './httpClient';
import { ENDPOINTS } from '@/constants/endpoints';

interface PayloadMovieList {
  slug: Slug;
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  year?: string;
}

export const movieService = {
  getListMovieBySlug: async ({
    slug,
    page = 1,
    limit = 24,
    category,
    country,
    year,
  }: PayloadMovieList): Promise<ResponseMovie> => {
    const response = await httpClient.get(`${ENDPOINTS.LIST}/${slug}`, {
      params: { page, limit, category, country, year },
    });
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
    const response = await httpClient.get(`${ENDPOINTS.SEARCH}/${keyword}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getCategories: async (): Promise<ResponseItem> => {
    const response = await httpClient.get(ENDPOINTS.CATEGORY);
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
  }): Promise<ResponseMovie> => {
    const response = await httpClient.get(`${ENDPOINTS.CATEGORY}/${category}`, {
      params: { page, limit, country, year },
    });
    return response.data;
  },

  getCountry: async (): Promise<ResponseItem> => {
    const response = await httpClient.get(ENDPOINTS.COUNTRY);
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
  }): Promise<ResponseMovie> => {
    const response = await httpClient.get(`${ENDPOINTS.COUNTRY}/${country}`, {
      params: { page, limit, year },
    });
    return response.data;
  },

  getDetailMovie: async (slug: string): Promise<ResponseMovieDetail> => {
    const response = await httpClient.get(`${ENDPOINTS.DETAIL}/${slug}`);
    return response.data;
  },
};
