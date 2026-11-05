import { apiPrivate, apiPublic } from '../lib/api-client.js';

export async function getProducts() {
  const response = await apiPublic.get('/product/fetch-products');
  return response.data;
}

export async function getAdminProducts(params) {
  const response = await apiPrivate.get('/product/admin-fetch-all-products', { params });
  return response.data;
}

export async function createProduct(formData) {
  const response = await apiPrivate.post('/product/create-product', formData);
  return response.data;
}

export async function updateProduct({ id, formData }) {
  const response = await apiPrivate.patch(`/product/update-product/${id}`, formData);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await apiPrivate.delete(`/product/delete-product/${id}`);
  return response.data;
}
