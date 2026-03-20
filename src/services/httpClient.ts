import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';

const httpClient = axios.create({
  baseURL: APP_CONFIG.API_MOVIE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
httpClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here in the future
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Unknown Error';
    if (__DEV__) {
      console.error(`[API Error] ${message}`);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
