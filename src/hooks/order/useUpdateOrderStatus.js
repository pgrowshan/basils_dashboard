import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '../../api/order.api.js';
import { orderQueryKeys } from './useGetOrders.js';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
}
