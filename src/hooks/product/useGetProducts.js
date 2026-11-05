import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAdminProducts, getProducts } from '../../api/product.api.js';

export const productQueryKeys = {
  all: ['GET_PRODUCTS'],
  admin: ['GET_ADMIN_PRODUCTS'],
  adminList: (params) => ['GET_ADMIN_PRODUCTS', params],
};

export function useGetProducts() {
  return useQuery({
    queryKey: productQueryKeys.all,
    queryFn: async () => {
      const response = await getProducts();
      return response.data || [];
    },
  });
}

export function useGetAdminProducts(params) {
  return useQuery({
    queryKey: productQueryKeys.adminList(params),
    queryFn: async () => {
      const response = await getAdminProducts(params);
      return {
        products: response.data?.products || [],
        counts: response.data?.counts || { all: 0 },
        meta: response.meta || { page: 1, limit: 20, total: 0, pages: 1 },
      };
    },
    placeholderData: keepPreviousData,
  });
}
