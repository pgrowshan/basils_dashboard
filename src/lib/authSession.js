const TOKEN_KEY = 'dashboardAccessToken';
const REFRESH_KEY = 'dashboardRefreshToken';
const USER_KEY = 'dashboardUser';

function writeSharedCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAuthSession({ accessToken, refreshToken, user }) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  writeSharedCookie('accessToken', accessToken);
  if (refreshToken) writeSharedCookie('refreshToken', refreshToken, 30);
  writeSharedCookie('user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  ['accessToken', 'refreshToken', 'user'].forEach((name) => {
    document.cookie = `${name}=; path=/; max-age=0`;
  });
  window.dispatchEvent(new Event('auth-change'));
}
