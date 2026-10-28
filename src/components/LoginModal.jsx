import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/auth/useLogin.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const loginMutation = useLogin();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password, keepSignedIn },
      { onSuccess: () => onClose() },
    );
  };

  const handleSignUpClick = () => {
    onClose(); // Close the modal
    navigate('/login'); // Navigate to the full signup/login page
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-[#1E110A]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[440px] bg-[#FFFDF9] rounded-2xl shadow-2xl p-8 md:p-10 z-50 flex flex-col items-center select-none animate-scale-up border border-[#FFF9E6]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1.5 cursor-pointer text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="font-gelica text-3xl font-normal text-[#0F172A] text-center mb-8 tracking-tight">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              id="modal-email"
              required
              disabled={loginMutation.isPending}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FFF9E6] border border-[#2E6BBE]/60 focus:border-[#2E6BBE] text-slate-800 placeholder-slate-500 text-sm font-sans px-4 py-3.5 rounded-lg outline-none transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              id="modal-password"
              required
              minLength={6}
              disabled={loginMutation.isPending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FFF9E6] border border-[#2E6BBE]/60 focus:border-[#2E6BBE] text-slate-800 placeholder-slate-500 text-sm font-sans px-4 py-3.5 rounded-lg outline-none transition-all duration-200"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-left mb-6">
            <span
              onClick={() => {
                onClose();
                navigate('/forgot-password');
              }}
              className="font-sans text-xs md:text-sm font-medium text-slate-700 hover:text-slate-950 underline underline-offset-4 cursor-pointer transition-colors duration-200"
            >
              Forgot your Password?
            </span>
          </div>

          {/* Log In Button */}
          {loginMutation.isError && (
            <p className="mb-4 rounded-[4px] border border-red-200 bg-red-50 p-2 text-center font-sans text-xs text-red-600">
              {getApiErrorMessage(loginMutation.error)}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-4 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent mb-5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Log In'}
          </button>

          {/* Keep Signed In Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none mb-8">
            <input
              type="checkbox"
              id="modal-keep-signed-in"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A]"
            />
            <span className="font-sans text-xs md:text-sm text-slate-700 font-medium">
              Keep me signed in until I sign out
            </span>
          </label>
        </form>

        {/* Dashed Separator */}
        <div className="w-full border-t border-dashed border-[#2E6BBE]/30 mb-6"></div>

        {/* Footer Text */}
        <p className="font-sans text-xs md:text-sm text-slate-800 text-center">
          New to Basil’s Bakery?{' '}
          <button
            onClick={handleSignUpClick}
            className="text-[#2E6BBE] hover:text-[#1d4f91] font-semibold underline underline-offset-4 cursor-pointer focus:outline-none"
          >
            Sign Up Here!
          </button>
        </p>

      </div>
    </div>
  );
}
