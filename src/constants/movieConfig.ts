import { Slug } from '@/types/movies';

export const CATEGORIES: { title: string; slug: Slug; variant?: 'portrait' | 'landscape' | 'ranked' | 'featured' }[] = [
  { title: 'Phim bộ mới', slug: 'phim-bo', variant: 'portrait' },
  { title: 'Phim lẻ mới', slug: 'phim-le', variant: 'landscape' },
  { title: 'TV Shows', slug: 'tv-shows', variant: 'ranked' },
  { title: 'Phim hoạt hình', slug: 'hoat-hinh', variant: 'portrait' },
  { title: 'Phim Vietsub', slug: 'phim-vietsub', variant: 'landscape' },
  { title: 'Phim thuyết minh', slug: 'phim-thuyet-minh', variant: 'portrait' },
  { title: 'Phim lồng tiếng', slug: 'phim-long-tien', variant: 'portrait' },
  { title: 'Phim bộ đang chiếu', slug: 'phim-bo-dang-chieu', variant: 'ranked' },
  { title: 'Phim bộ đã hoàn thành', slug: 'phim-bo-hoan-thanh', variant: 'portrait' },
  { title: 'Phim sắp chiếu', slug: 'phim-sap-chieu', variant: 'featured' },
  { title: 'Subteam', slug: 'subteam', variant: 'portrait' },
  { title: 'Phim chiếu rạp', slug: 'phim-chieu-rap', variant: 'landscape' },
];
