import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/product.api.js';

export const productQueryKeys = {
  all: ['GET_PRODUCTS'],
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
