import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../../api/category.api.js';
import { categoryQueryKeys } from './useGetCategories.js';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}
