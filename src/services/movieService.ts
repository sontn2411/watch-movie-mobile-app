import api from './api';

export interface Movie {
  id: number;
  title: string;
  body: string;
}

export const movieService = {
  getMovies: async (): Promise<Movie[]> => {
    // Using posts as a demo for movies
    const response = await api.get<Movie[]>('/posts?_limit=5');
    return response.data;
  },
};
