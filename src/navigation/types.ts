import { Slug } from '@/types/movies';

export type RootStackParamList = {
  Main: undefined;
  Details: { id: string; title: string };
  SeeMore: { title: string; slug: Slug };
  Watch: {
    url: string;
    title: string;
    currentEpisode: string;
    slug: string;
    serverIndex?: number;
  };
  Welcome: undefined;
  Auth: undefined;
  History: undefined;
  Favorites: undefined;
  DownloadEpisodes: { movieSlug: string; movieName: string };
  WatchOffline: { url: string; title: string; episodeName: string; movieSlug: string };
};
