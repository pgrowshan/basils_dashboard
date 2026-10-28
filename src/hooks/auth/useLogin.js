import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/auth.api.js';
import { saveAuthSession } from '../../lib/authSession.js';

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      return loginUser({ email, password });
    },
    onSuccess: (response, variables) => {
      const session = response?.data;
      if (!session?.accessToken || !session?.user) return;
      saveAuthSession(
        {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
        },
        variables.keepSignedIn !== false,
      );
    },
  });
}
