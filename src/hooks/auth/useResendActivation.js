import { useMutation } from '@tanstack/react-query';
import { resendActivation } from '../../api/auth.api.js';

export function useResendActivation() {
  return useMutation({
    mutationFn: async ({ email }) => resendActivation(email),
  });
}
