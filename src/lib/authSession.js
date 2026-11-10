const TOKEN_KEY = 'dashboardAccessToken';
const REFRESH_KEY = 'dashboardRefreshToken';
const USER_KEY = 'dashboardUser';

let redirectingToLogin = false;

function readJwtPayload(token) {
  try {
    const payload = String(token || '').split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function writeSharedCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAccessTokenValid(token = getAccessToken()) {
  if (!token) return false;
  const payload = readJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now() + 1000;
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function hasUsableSession() {
  return isAccessTokenValid() || isAccessTokenValid(getRefreshToken());
}

export function updateAccessToken(accessToken, user) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
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

export function endSessionAndRedirectToLogin() {
  clearAuthSession();
  if (typeof window === 'undefined') return;
  const onLogin = window.location.pathname === '/login';
  if (onLogin || redirectingToLogin) return;
  redirectingToLogin = true;
  window.location.assign('/login');
}
