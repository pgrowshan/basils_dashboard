import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/category.api.js';

export const categoryQueryKeys = {
  all: ['GET_CATEGORIES'],
};

export function useGetCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.all,
    queryFn: async () => {
      const response = await getCategories();
      return response.data || [];
    },
  });
}
