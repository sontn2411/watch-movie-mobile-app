import Config from 'react-native-config';

export const APP_CONFIG = {
  API_URL: Config.API_URL || 'https://jsonplaceholder.typicode.com',
  APP_NAME: Config.APP_NAME || 'WatchMovie',
  ENVIRONMENT: Config.ENVIRONMENT || 'development',
};
