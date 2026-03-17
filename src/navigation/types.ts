import { Slug } from '@/types/movies';

export type RootStackParamList = {
  Main: undefined;
  Details: { id: string; title: string };
  SeeMore: { title: string; slug: Slug };
};
