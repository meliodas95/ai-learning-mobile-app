import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { API_BASE_URL, Endpoints } from './endpoints';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    const isLoginEndpoint =
      config.url === Endpoints.LOGIN ||
      config.url === Endpoints.LOGIN_MEMBER;

    if (!isLoginEndpoint && getAccessToken) {
      const token = getAccessToken();
      if (token) {
        config.headers.set('x-access-token', token);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: extract data
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    return Promise.reject(error.response ?? error);
  },
);

export default apiClient;
