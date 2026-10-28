import { useEffect, useState } from 'react';
import { useLogin } from '../hooks/auth/useLogin.js';
import { clearAuthSession, getAccessToken, getStoredUser, saveAuthSession } from '../lib/authSession.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

function redirectToDashboard() {
  window.location.assign('/categories');
}

export default function AdminLogin() {
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (getAccessToken() && user?.role === 'admin') {
      redirectToDashboard();
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError('');
    loginMutation.mutate(
      { email, password, keepSignedIn: true },
      {
        onSuccess: (response) => {
          const session = response?.data;
          if (!session?.accessToken || session.user?.role !== 'admin') {
            clearAuthSession();
            setFormError('This account is not an admin.');
            return;
          }
          saveAuthSession({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            user: session.user,
          });
          redirectToDashboard();
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#4372B8] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#FFFDF8] p-8">
        <h1 className="font-gelica text-3xl text-[#1A2744]">Admin login</h1>
        <p className="mt-2 font-['Circe'] text-sm text-[#5C6B82]">Sign in with an admin account to add categories and products.</p>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="mt-6 w-full border border-[#D7DEE8] px-3 py-3 font-['Circe']"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="mt-3 w-full border border-[#D7DEE8] px-3 py-3 font-['Circe']"
        />
        {(formError || loginMutation.isError) && (
          <p className="mt-3 font-['Circe'] text-sm text-red-600">
            {formError || getApiErrorMessage(loginMutation.error)}
          </p>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-5 w-full cursor-pointer bg-[#0F172A] py-3 font-['Circe'] text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
