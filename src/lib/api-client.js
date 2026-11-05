import axios from 'axios';
import { endSessionAndRedirectToLogin, getAccessToken, isAccessTokenValid } from './authSession.js';

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

apiPrivate.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !isAccessTokenValid(token)) {
    endSessionAndRedirectToLogin();
    return Promise.reject(new Error('Session expired'));
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
  (error) => {
    if (error.response?.status === 401) {
      endSessionAndRedirectToLogin();
    }
    return Promise.reject(error);
  },
);
