import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../lib/authSession.js';
import cart from "/cartIcon.png"
import logoWhite from '../assets/nav/nav-logo-white.svg';
import logoBlue from '../assets/nav/nav-logo-blue.svg';
import mobileLogoWhite from '../assets/nav/mobile-nav-logo-white.svg';
import mobileLogoBlue from '../assets/nav/mobile-nav-logo-blue.svg';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import LoginModal from '../components/LoginModal';

const NAV_LINKS = [
  { path: '/', label: 'Home', productLabel: 'Home' },
  { path: '/start-here', label: 'Start Here', productLabel: 'Start Here' },
  { path: '/chocolates', label: 'Chocolates', productLabel: 'Chocolates' },
  { path: '/our-mission', label: 'Our Mission', productLabel: 'Our story' },
];

const MOBILE_LINKS = [
  { path: '/start-here', label: 'Start Here' },
  { path: '/chocolates', label: 'Chocolates' },
  { path: '/our-mission', label: 'Our Story' },
  { path: '/our-mission', label: 'Contact Us' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { openCart, totalItems } = useCart();

  const location = useLocation();
  const navigate = useNavigate();
  const [menuPath, setMenuPath] = useState(location.pathname);
  const shopNav = location.pathname === '/chocolates';
  const productNav = location.pathname.startsWith('/chocolates/');
  const checkoutNav = ['/checkout', '/payment', '/invoice'].includes(location.pathname);
  const historyNav = location.pathname === '/account/orders';
  const accountNav = location.pathname.startsWith('/account') && !historyNav;
  const creamNav = checkoutNav || historyNav;
  const lightNav = shopNav;
  const sentenceNav = productNav || creamNav || accountNav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };
    syncUser();
    window.addEventListener('auth-change', syncUser);
    return () => window.removeEventListener('auth-change', syncUser);
  }, [location]);

  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname);
    setIsOpen(false);
  }

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${productNav || creamNav || accountNav ? 'py-3 md:py-3.5' : isScrolled ? 'py-3 md:py-4' : 'py-5 md:py-6'}`}>
      
      {!lightNav && !productNav && !creamNav && !accountNav && (
        <>
          <div 
            className={`absolute inset-0 hidden bg-[#1E110A]/20 backdrop-blur-lg shadow-lg border-b border-white/10 transition-opacity duration-700 md:block ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
          <div 
            className={`absolute inset-0 hidden bg-gradient-to-b from-black/60 via-black/20 to-transparent transition-opacity duration-700 md:block ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-[#4c76b4] transition-opacity duration-300 md:hidden ${
              isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        </>
      )}

      {lightNav && (
        <div
          className={`absolute inset-0 bg-[#FFF9F3] shadow-sm transition-opacity duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      {productNav && (
        <>
          <div className="absolute inset-0 bg-[#FFFAF4] md:hidden" />
          <div className="absolute inset-0 hidden bg-[#4372B8] md:block" />
        </>
      )}

      {creamNav && <div className="absolute inset-0 bg-[#FFFAF4]" />}

      {accountNav && <div className="absolute inset-0 bg-[#4372B8]" />}

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-5 text-white md:px-12">
        <div className="grid grid-cols-3 items-center md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className={`justify-self-start p-1 focus:outline-none ${lightNav || productNav || creamNav ? 'text-[#4372B8]' : 'text-[#F8ECB7]'}`}
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link to="/" className="justify-self-center" onClick={() => setIsOpen(false)}>
            <img src={lightNav || productNav || creamNav ? mobileLogoBlue : mobileLogoWhite} alt="Basil's Bakery" className="h-10 w-auto object-contain" />
          </Link>

          <button
            onClick={openCart}
            className={`relative justify-self-end p-1 focus:outline-none ${lightNav || productNav || creamNav ? 'text-[#4372B8]' : 'text-[#F8ECB7]'}`}
            aria-label="Open cart"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 8h11l-.8 12H7.3L6.5 8z" />
              <path strokeLinecap="round" d="M9 8V7a3 3 0 0 1 6 0v1" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#3b6eba] px-0.5 text-[9px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="hidden items-center justify-between md:flex">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity duration-300">
          <img src={lightNav || creamNav ? logoBlue : logoWhite} alt="Basil's Bakery" className="h-10 w-auto object-contain" />
        </Link>

        {/* Center Desktop Links */}
        <div className={`hidden md:flex items-center font-sans font-semibold ${sentenceNav ? 'space-x-8 text-[15px] font-medium normal-case tracking-normal' : 'space-x-10 text-xs uppercase tracking-[0.15em]'}`}>
          {NAV_LINKS.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => 
                `relative group py-2 transition-colors duration-300 ${
                  lightNav
                    ? isActive ? 'text-[#4372B8]' : 'text-[#0F172A] hover:text-[#4372B8]'
                    : creamNav
                      ? 'text-[#4372B8] hover:text-[#2E5A9A]'
                    : productNav || accountNav
                      ? isActive ? 'text-white' : 'text-[#F8EFB8] hover:text-white'
                      : isActive ? 'text-white' : 'text-[#F9EBB4] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {sentenceNav ? item.productLabel : item.label}
                  {!creamNav && !accountNav && (
                    <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ease-out ${
                      lightNav ? 'bg-[#4372B8]' : 'bg-[#F9EBB4]'
                    } ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Desktop Utilities */}
        <div className={`hidden md:flex items-center space-x-8 font-sans font-medium ${sentenceNav ? 'text-[15px] normal-case tracking-normal' : 'text-xs tracking-widest'}`}>
          {accountNav || historyNav ? (
            <Link to="/account" className={`flex items-center gap-2.5 ${historyNav ? 'text-[#4372B8]' : 'text-[#F8EFB8]'}`}>
              <div className={`rounded-full border p-2 ${historyNav ? 'border-[#4372B8]/40' : 'border-white/40'}`}>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span>My Account</span>
            </Link>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link to="/account" className={`font-semibold text-xs tracking-wider uppercase ${lightNav || checkoutNav ? 'text-[#4372B8]' : 'text-[#F9EBB4]'}`}>Hi, {user.firstName}</Link>
              <button 
                onClick={handleLogout}
                className={`transition-colors duration-300 tracking-wider uppercase font-semibold cursor-pointer ${lightNav || checkoutNav ? 'text-[#0F172A]/70 hover:text-[#4372B8]' : 'text-white/70 hover:text-[#F9EBB4]'}`}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className={`flex items-center gap-2.5 transition-all duration-300 group focus:outline-none cursor-pointer ${checkoutNav ? 'text-[#4372B8]' : lightNav ? 'text-[#0F172A] hover:text-[#4372B8]' : 'text-white/90 hover:text-[#F9EBB4]'}`}
            >
              <div className={`p-2 rounded-full border transition-colors ${checkoutNav ? 'border-[#4372B8]/40' : lightNav ? 'border-[#0F172A]/20 group-hover:border-[#4372B8]/60' : 'border-white/20 group-hover:border-[#F9EBB4]/60'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span className="mt-0.5">{sentenceNav ? 'Sign Up | Login' : 'SIGN UP | LOGIN'}</span>
            </button>
          )}

          <button 
            onClick={openCart} 
            className={`flex items-center gap-2 transition-all duration-300 group focus:outline-none cursor-pointer ${lightNav || creamNav ? 'text-[#4372B8]' : 'text-white/90 hover:text-[#F9EBB4]'}`}
            aria-label="Open cart"
          >
            <div className="p-2 rounded-full border border-transparent group-hover:border-[#F9EBB4]/60 transition-colors relative">
              {lightNav || creamNav ? (
                <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 8h11l-.8 12H7.3L6.5 8z" />
                  <path strokeLinecap="round" d="M9 8V7a3 3 0 0 1 6 0v1" />
                </svg>
              ) : (
                <img src={cart} alt="Cart" className="w-[18px] h-[18px] object-contain" />
              )}
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3b6eba] text-white text-[9px] font-sans font-bold rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>

        </div>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#F8ECB7] md:hidden">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute left-5 top-6 text-[#4372B8] focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6">
            {MOBILE_LINKS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="font-gelica text-[36px] leading-none text-[#4372B8]"
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (user) navigate('/account');
              else setIsLoginOpen(true);
            }}
            className="mb-12 flex items-center justify-center gap-2.5 self-center text-[#4372B8] focus:outline-none"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="10" r="2.4" />
              <path strokeLinecap="round" d="M7.8 16.4a4.4 4.4 0 0 1 8.4 0" />
            </svg>
            <span className="font-gelica text-[22px] leading-none">
              {user ? 'My Account' : 'Sign Up | Login'}
            </span>
          </button>
        </div>,
        document.body
      )}

      {/* Cart Drawer Portal overlay */}
      <CartDrawer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
}

export default Navbar;