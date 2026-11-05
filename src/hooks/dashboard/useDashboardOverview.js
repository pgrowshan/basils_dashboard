import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview } from '../../api/dashboard.api.js';

export const dashboardQueryKeys = {
  overview: ['GET_DASHBOARD_OVERVIEW'],
};

export function useDashboardOverview() {
  return useQuery({
    queryKey: dashboardQueryKeys.overview,
    queryFn: getDashboardOverview,
  });
}
