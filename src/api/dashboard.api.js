import { apiPrivate } from '../lib/api-client.js';

export async function getDashboardOverview() {
  const response = await apiPrivate.get('/dashboard/overview');
  return response.data?.data;
}
