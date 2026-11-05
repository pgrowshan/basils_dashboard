import { apiPrivate } from '../lib/api-client.js';

export async function getAllOrders(params = {}) {
  const response = await apiPrivate.get('/order/admin-fetch-all-orders', { params });
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await apiPrivate.patch(`/order/update-status/${id}`, { status });
  return response.data;
}

export async function bulkUpdateOrderStatus(ids, status) {
  const response = await apiPrivate.patch('/order/bulk-status', { ids, status });
  return response.data;
}
