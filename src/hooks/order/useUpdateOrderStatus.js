import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkUpdateOrderStatus, updateOrderStatus } from '../../api/order.api.js';
import { dashboardQueryKeys } from '../dashboard/useDashboardOverview.js';
import { orderQueryKeys } from './useGetOrders.js';

async function refreshLists(queryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.overview }),
  ]);
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => refreshLists(queryClient),
  });
}

export function useBulkUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }) => bulkUpdateOrderStatus(ids, status),
    onSuccess: () => refreshLists(queryClient),
  });
}
