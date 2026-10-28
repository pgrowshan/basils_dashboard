import { useMutation } from '@tanstack/react-query';
import { verifyRegisterToken } from '../../api/auth.api.js';
import { saveAuthSession } from '../../lib/authSession.js';

export function useVerifyRegistration() {
  return useMutation({
    mutationFn: verifyRegisterToken,
    onSuccess: (response) => {
      const session = response?.data;
      const user = session?.user || session?.userResponse;
      if (!session?.accessToken || !user) return;
      saveAuthSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user,
      });
    },
  });
}
