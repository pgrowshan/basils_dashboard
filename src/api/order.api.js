import { apiPrivate } from '../lib/api-client.js';

export async function getAllOrders() {
  const response = await apiPrivate.get('/order/admin-fetch-all-orders');
  return response.data;
}

export async function updateOrderStatus(id, status) {
  const response = await apiPrivate.patch(`/order/update-status/${id}`, { status });
  return response.data;
}
