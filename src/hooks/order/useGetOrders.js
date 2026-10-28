import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../../api/order.api.js';

export const orderQueryKeys = {
  all: ['GET_ORDERS'],
};

export function useGetOrders() {
  return useQuery({
    queryKey: orderQueryKeys.all,
    queryFn: async () => {
      const response = await getAllOrders();
      return response.data || [];
    },
  });
}
