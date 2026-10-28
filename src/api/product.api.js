import { apiPrivate, apiPublic } from '../lib/api-client.js';

export async function getProducts() {
  const response = await apiPublic.get('/product/fetch-products');
  return response.data;
}

export async function createProduct(formData) {
  const response = await apiPrivate.post('/product/create-product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
