import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, updateProduct } from '../../api/product.api.js';
import { productQueryKeys } from './useGetProducts.js';

async function refreshCatalog(queryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: productQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: productQueryKeys.admin }),
  ]);
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await refreshCatalog(queryClient);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: async () => {
      await refreshCatalog(queryClient);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await refreshCatalog(queryClient);
    },
  });
}
