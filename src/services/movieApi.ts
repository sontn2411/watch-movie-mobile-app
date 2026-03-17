import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';

const movieApi = axios.create({
  baseURL: APP_CONFIG.API_MOVIE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default movieApi;
