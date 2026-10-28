import { apiPublic } from '../lib/api-client.js';

export async function registerUser(userData) {
  const response = await apiPublic.post('/auth/register', userData);
  return response.data;
}

export async function resendActivation(email) {
  const response = await apiPublic.post('/auth/resend-activation', { email });
  return response.data;
}

export async function loginUser(payload) {
  const response = await apiPublic.post('/auth/login', payload);
  return response.data;
}

export async function verifyRegisterToken({ token, purpose }) {
  const response = await apiPublic.post('/auth/register-verification', null, {
    params: { token, purpose },
  });
  return response.data;
}
