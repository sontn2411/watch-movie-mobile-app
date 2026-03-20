import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';
import { useAppStore } from '@/store/useAppStore';

const apiClient = axios.create({
  baseURL: APP_CONFIG.API_CLIENT_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  config => {
    const token = useAppStore.getState().userToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(
        `[Auth API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    const { refreshToken, setAuth, logout } = useAppStore.getState();

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshToken) {
        originalRequest._retry = true;
        try {
          // Import authService dynamically to avoid circular dependency
          const { default: authService } = await import('./auth');
          const response = await authService.refreshToken(refreshToken);

          if (response.accessToken) {
            setAuth(
              response.accessToken,
              response.refreshToken || refreshToken,
              response.user,
            );
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        logout();
      }
    }

    const message =
      error.response?.data?.message || error.message || 'Unknown Error';
    if (__DEV__) {
      console.error(`[Auth API Error] ${message}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
