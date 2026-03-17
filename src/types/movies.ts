export type Slug =
  | 'phim-moi'
  | 'phim-bo'
  | 'phim-le'
  | 'tv-shows'
  | 'hoat-hinh'
  | 'phim-vietsub'
  | 'phim-thuyet-minh'
  | 'phim-long-tien'
  | 'phim-bo-dang-chieu'
  | 'phim-bo-hoan-thanh'
  | 'phim-sap-chieu'
  | 'subteam'
  | 'phim-chieu-rap';

interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}

interface ParamsData {
  type_slug: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string;
  filterType: string;
  sortField: string;
  sortType: string;
  pagination: Pagination;
}

export interface Tmdb {
  type: string;
  id: string;
  season: number;
  vote_average: number;
  vote_count: number;
}

export interface Imdb {
  id: string;
  vote_average: number;
  vote_count: number;
}

export interface Item {
  id: string;
  name: string;
  slug: string;
}

export interface Item_ {
  _id: string;
  name: string;
  slug: string;
}

export interface EpisodeItem {
  server_name: string;
  is_ai: boolean;
  name: string;
}

export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;
  tmdb: Tmdb;
  imdb: Imdb;
  modified: {
    time: string;
  };
  category: Item[];
  country: Item[];
  last_episodes: EpisodeItem[];
}

export interface ResponseMovie {
  status: string;
  message: string;
  data: {
    titlePage: string;
    items: MovieItem[];
    params: ParamsData;
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface ResponseItem {
  status: string;
  message: string;
  data: {
    items: Item_[];
  };
}

interface Episode {
  server_name: string;
  is_ai: boolean;
  server_data: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }[];
}

export interface MovieDetail {
  tmdb: Tmdb;
  imdb: Imdb;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  alternative_names: string[];
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Item[];
  country: Item[];
  modified: {
    time: string;
  };
  created: {
    time: string;
  };
  episodes: Episode[];
}

export interface ResponseMovieDetail {
  status: string;
  message: string;
  data: {
    titlePage: string;
    item: MovieDetail;
    params: ParamsData;
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}
