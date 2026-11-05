import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllOrders } from '../../api/order.api.js';

export const orderQueryKeys = {
  all: ['GET_ORDERS'],
  list: (params) => ['GET_ORDERS', params],
};

export function useGetOrders(params) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: async () => {
      const response = await getAllOrders(params);
      return {
        orders: response.data?.orders || [],
        counts: response.data?.counts || {},
        meta: response.meta || { page: 1, limit: 25, total: 0, pages: 1 },
      };
    },
    placeholderData: keepPreviousData,
  });
}
