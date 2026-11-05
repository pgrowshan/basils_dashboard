import { useEffect, useState } from 'react';
import { useLogin } from '../hooks/auth/useLogin.js';
import { clearAuthSession, getAccessToken, getStoredUser, isAccessTokenValid, saveAuthSession } from '../lib/authSession.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Button, Field, Input, StatusNote } from './ui.jsx';

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
    if (isAccessTokenValid() && user?.role === 'admin') {
      redirectToDashboard();
      return;
    }
    if (getAccessToken() || user) {
      clearAuthSession();
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
    <div className="flex min-h-screen items-center justify-center bg-[#4372B8] px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-[#FFFDF8] p-6 shadow-xl sm:p-8">
        <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.18em] text-[#4372B8] uppercase">Basil's Bakery</p>
        <h1 className="mt-2 font-gelica text-3xl text-[#1A2744]">Admin login</h1>
        <p className="mt-2 font-['Circe'] text-sm leading-relaxed text-[#5C6B82]">
          Sign in with an admin account to manage the shop.
        </p>
        <div className="mt-6 grid gap-4">
          <Field label="Email">
            <Input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@email.com" />
          </Field>
          <Field label="Password">
            <Input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
          </Field>
        </div>
        {(formError || loginMutation.isError) && (
          <div className="mt-3">
            <StatusNote tone="danger">{formError || getApiErrorMessage(loginMutation.error)}</StatusNote>
          </div>
        )}
        <Button type="submit" disabled={loginMutation.isPending} className="mt-5 w-full">
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
