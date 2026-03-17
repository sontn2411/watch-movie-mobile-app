import Config from 'react-native-config';

export const APP_CONFIG = {
  API_URL: Config.API_URL || 'https://jsonplaceholder.typicode.com',
  APP_NAME: Config.APP_NAME || 'WatchMovie',
  ENVIRONMENT: Config.ENVIRONMENT || 'development',
  API_MOVIE_URL: Config.API_MOVIE_URL || 'https://ophim1.com/v1/api',
};
