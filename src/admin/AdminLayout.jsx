import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { clearAuthSession, getStoredUser, isAccessTokenValid } from '../lib/authSession.js';
import logoWhite from '../assets/nav/nav-logo-white.svg';
import logoBlue from '../assets/nav/nav-logo-blue.svg';

function Icon({ name }) {
  const icons = {
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
    ),
    categories: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h6v6H4V6zm10 0h6v6h-6V6zM4 16h6v6H4v-6zm10 0h6v6h-6v-6z" />
    ),
    products: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    ),
    orders: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a2 2 0 012 2v12l-5-2-5 2V7a2 2 0 012-2zm0 4h6M9 13h4" />
    ),
    promos: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M5 4h6l8 8-6 6-8-8V4z" />
    ),
    offer: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    shipping: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3V7zm11 3h4l3 3v3h-7v-6zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z" />
    ),
  };

  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      {icons[name]}
    </svg>
  );
}

const LINKS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/categories', label: 'Categories', icon: 'categories' },
  { to: '/products', label: 'Products', icon: 'products' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/promos', label: 'Promos', icon: 'promos' },
  { to: '/special-offer', label: 'Special offer', icon: 'offer' },
  { to: '/shipping', label: 'Shipping rates', icon: 'shipping' },
];

function Sidebar({ onNavigate, user }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/15 px-5 py-5">
        <img src={logoWhite} alt="Basil's Bakery" className="h-10 w-auto object-contain" />
        <p className="mt-3 font-gelica text-xl text-white">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-xl px-3 py-2.5 font-circe text-sm font-medium transition',
                isActive
                  ? 'bg-white text-[#4372B8] shadow-sm'
                  : 'text-white/85 hover:bg-white/15 hover:text-white',
              ].join(' ')
            }
          >
            <Icon name={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/15 px-5 py-4">
        <p className="truncate font-circe text-xs text-white/80">{user.email}</p>
        <p className="mt-0.5 font-circe text-[11px] text-[#F8ECB7]/80">Administrator</p>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [, setAuthTick] = useState(0);
  const user = getStoredUser();
  const signedIn = isAccessTokenValid() && user?.role === 'admin';
  const current = LINKS.find((link) =>
    link.end ? location.pathname === link.to : location.pathname.startsWith(link.to),
  );

  useEffect(() => {
    const sync = () => setAuthTick((tick) => tick + 1);
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  const [menuPath, setMenuPath] = useState(location.pathname);
  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!signedIn) return <Navigate to="/login" replace />;

  const logout = () => {
    clearAuthSession();
    window.location.assign('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A2744] lg:pl-[260px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] bg-[#4372B8] lg:block">
        <Sidebar user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <aside className="relative h-full w-[260px] bg-[#4372B8] shadow-2xl">
            <Sidebar user={user} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[#E6E1D6] bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E6E1D6] text-[#1A2744] lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <img src={logoBlue} alt="Basil's Bakery" className="hidden h-8 w-auto object-contain sm:block lg:hidden" />
          <div className="min-w-0">
            <p className="font-circe text-[10px] tracking-[0.16em] text-[#7A8BA3] uppercase">Dashboard</p>
            <h1 className="truncate font-gelica text-lg text-[#1A2744] sm:text-xl">{current?.label || 'Admin'}</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer rounded-xl border border-[#D7DEE8] px-3 py-2 font-circe text-xs font-semibold text-[#1A2744] hover:bg-[#F4F1EA] sm:px-4 sm:text-sm"
        >
          Log out
        </button>
      </header>

      <main className="px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
