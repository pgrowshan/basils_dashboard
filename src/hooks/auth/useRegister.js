import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../api/auth.api.js';

export function useRegister() {
  return useMutation({
    mutationFn: async ({ firstName, lastName, email, password }) => {
      return registerUser({ firstName, lastName, email, password });
    },
  });
}
