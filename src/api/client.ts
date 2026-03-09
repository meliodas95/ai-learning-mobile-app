import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { API_BASE_URL, Endpoints } from './endpoints';
import { API_TIMEOUT } from '@/src/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let getAccessToken: (() => string | null) | null = null;

export function setTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

// Request interceptor: inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isPublicEndpoint =
      config.url === Endpoints.LOGIN ||
      config.url === Endpoints.LOGIN_MEMBER ||
      config.url === Endpoints.REGISTER_SEND_OTP ||
      config.url === Endpoints.REGISTER_VERIFY_OTP ||
      config.url === Endpoints.REGISTER_SAVE_PASSWORD ||
      config.url === Endpoints.FORGOT_PASSWORD;

    if (!isPublicEndpoint && getAccessToken) {
      const token = getAccessToken();
      if (token) {
        config.headers.set('x-access-token', token);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: extract data + handle 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Dynamic import to avoid circular dependency
      import('@/src/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
    }
    return Promise.reject(error.response ?? error);
  },
);

export default apiClient;
