import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../../api/product.api.js';
import { productQueryKeys } from './useGetProducts.js';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
}
