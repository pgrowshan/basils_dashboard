import axios from 'axios';
import {
  endSessionAndRedirectToLogin,
  getAccessToken,
  getRefreshToken,
  isAccessTokenValid,
  updateAccessToken,
} from './authSession.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const apiPublic = axios.create({
  baseURL,
  headers,
});

export const apiPrivate = axios.create({
  baseURL,
  headers,
  withCredentials: true,
});

let refreshing = null;

function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!isAccessTokenValid(refreshToken)) return Promise.resolve(null);
  if (!refreshing) {
    refreshing = apiPublic
      .post('/auth/refresh-token', { refreshToken })
      .then((response) => {
        const { accessToken, user } = response.data?.data || {};
        if (!accessToken || user?.role !== 'admin') return null;
        updateAccessToken(accessToken, user);
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

apiPrivate.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  if (token && !isAccessTokenValid(token)) {
    token = await refreshAccessToken();
    if (!token) {
      endSessionAndRedirectToLogin();
      return Promise.reject(new Error('Session expired'));
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

apiPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401) return Promise.reject(error);
    if (original && !original._retried) {
      original._retried = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return apiPrivate(original);
      }
    }
    endSessionAndRedirectToLogin();
    return Promise.reject(error);
  },
);
