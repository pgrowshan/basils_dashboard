import { apiPrivate, apiPublic } from '../lib/api-client.js';

export async function getCategories() {
  const response = await apiPublic.get('/category');
  return response.data;
}

export async function createCategory(formData) {
  const response = await apiPrivate.post('/category/create-category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
