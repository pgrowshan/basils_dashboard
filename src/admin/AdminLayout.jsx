import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { clearAuthSession, getAccessToken, getStoredUser } from '../lib/authSession.js';

export default function AdminLayout() {
  const user = getStoredUser();
  if (!getAccessToken() || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1A2744]">
      <header className="flex items-center justify-between bg-[#4372B8] px-6 py-4 text-white">
        <div>
          <p className="font-['Circe'] text-xs tracking-[0.16em]">BASIL'S BAKERY</p>
          <h1 className="font-gelica text-2xl">Admin</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            clearAuthSession();
            window.location.assign('/login');
          }}
          className="cursor-pointer border border-white px-4 py-2 font-['Circe'] text-sm"
        >
          Log out
        </button>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-3 md:flex-col">
          <NavLink to="/categories" className={({ isActive }) => `px-3 py-2 font-['Circe'] ${isActive ? 'bg-[#4372B8] text-white' : 'bg-white'}`}>Categories</NavLink>
          <NavLink to="/products" className={({ isActive }) => `px-3 py-2 font-['Circe'] ${isActive ? 'bg-[#4372B8] text-white' : 'bg-white'}`}>Products</NavLink>
          <NavLink to="/orders" className={({ isActive }) => `px-3 py-2 font-['Circe'] ${isActive ? 'bg-[#4372B8] text-white' : 'bg-white'}`}>Orders</NavLink>
          <NavLink to="/promos" className={({ isActive }) => `px-3 py-2 font-['Circe'] ${isActive ? 'bg-[#4372B8] text-white' : 'bg-white'}`}>Promos</NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
