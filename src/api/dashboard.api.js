import { getMockDashboardOverview } from '../admin/home/mock.ts';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Admin home overview.
 *
 * Swap the mock return for a live request when the endpoint is ready:
 *   const response = await apiPrivate.get('/dashboard/overview');
 *   return response.data;
 */
export async function getDashboardOverview() {
  await wait(280);
  return getMockDashboardOverview();
}
