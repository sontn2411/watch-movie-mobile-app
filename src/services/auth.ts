import {
  PayloadLogin,
  PayloadRegister,
  ResponseLogin,
  ResponseRegister,
} from '@/types/auth';
import apiClient from './apiClient';

const authService = {
  register: async ({
    email,
    password,
    username,
  }: PayloadRegister): Promise<ResponseRegister> => {
    const response = await apiClient.post('/users/register', {
      email,
      password,
      username,
    });
    return response.data;
  },
  login: async ({
    identity,
    password,
  }: PayloadLogin): Promise<ResponseLogin> => {
    const response = await apiClient.post('/users/login', {
      identity,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ResponseLogin> => {
    const response = await apiClient.post('/users/refresh ', {
      refreshToken,
    });
    return response.data;
  },
  profile: async (): Promise<ResponseLogin> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
};

export default authService;
