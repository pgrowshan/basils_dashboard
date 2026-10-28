import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/auth/useRegister.js';
import { useLogin } from '../hooks/auth/useLogin.js';
import { useResendActivation } from '../hooks/auth/useResendActivation.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import stayBg from '../assets/stay_bg.svg';

function Signup() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    ageAgreed: false
  });

  const [logInData, setLogInData] = useState({
    email: '',
    password: ''
  });

  const signupMutation = useRegister();
  const loginMutation = useLogin();
  const resendMutation = useResendActivation();
  const signupError = signupMutation.isError ? getApiErrorMessage(signupMutation.error) : '';
  const canResend = signupError.toLowerCase().includes('already registered');

  const handleResend = () => {
    if (!signUpData.email) return;
    resendMutation.mutate(
      { email: signUpData.email },
      { onSuccess: () => setIsSubmitted(true) },
    );
  };

  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogInChange = (e) => {
    const { name, value } = e.target;
    setLogInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpData.ageAgreed) {
      alert('You must confirm you are over 19 years of age.');
      return;
    }
    signupMutation.mutate({
      firstName: signUpData.firstName,
      lastName: signUpData.lastName,
      email: signUpData.email,
      password: signUpData.password
    }, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  const handleLogInSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(logInData, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div 
      className="relative min-h-screen w-full py-28 px-4 md:px-6 flex flex-col items-center justify-center gap-8 select-none bg-[#2E6BBE]"
      style={{ 
        backgroundImage: `url(${stayBg})`,
        backgroundSize: '320px 240px',
        backgroundRepeat: 'repeat'
      }}
    >
      
      {isSubmitted ? (
        <div className="w-full max-w-[500px] bg-[#FFFDF9] p-8 md:p-10 rounded-[4px] shadow-2xl flex flex-col items-center justify-center text-center z-10">
          <h2 className="font-gelica text-3xl md:text-[34px] font-normal text-[#0F172A] text-center mb-6 leading-tight select-none">
            Thank you for joining.
          </h2>
          
          <p className="font-sans text-sm md:text-base text-slate-800 text-center mb-8 leading-relaxed">
            {signupMutation.data?.message || "Please check your inbox to validate your account."}
            <br />
            You're almost there.
          </p>

          {resendMutation.isError && (
            <p className="mb-4 font-sans text-sm text-red-600">
              {getApiErrorMessage(resendMutation.error)}
            </p>
          )}
          {resendMutation.isSuccess && (
            <p className="mb-4 font-sans text-sm text-slate-700">
              {resendMutation.data?.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resendMutation.isPending ? 'Sending link...' : 'Resend Link'}
          </button>
        </div>
      ) : (
        <>
          {/* CARD 1: Sign Up */}
          <div className="w-full max-w-[500px] bg-[#FFFDF9] p-8 md:p-10 rounded-[4px] shadow-2xl flex flex-col z-10">
            <h2 className="font-gelica text-3xl md:text-[34px] font-normal text-[#0F172A] text-center mb-8 select-none">
              Sign Up
            </h2>
            
            <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4 w-full">
              <input
                type="text"
                name="firstName"
                required
                disabled={signupMutation.isPending}
                placeholder="First Name"
                value={signUpData.firstName}
                onChange={handleSignUpChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="text"
                name="lastName"
                required
                disabled={signupMutation.isPending}
                placeholder="Last Name"
                value={signUpData.lastName}
                onChange={handleSignUpChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="email"
                name="email"
                required
                disabled={signupMutation.isPending}
                placeholder="Email Address"
                value={signUpData.email}
                onChange={handleSignUpChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                disabled={signupMutation.isPending}
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />
              
              {/* Age restriction checkbox */}
              <label className="flex items-center gap-3 mt-2 mb-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="ageAgreed"
                  disabled={signupMutation.isPending}
                  checked={signUpData.ageAgreed}
                  onChange={handleSignUpChange}
                  className="w-4 h-4 rounded border-slate-300 text-[#0F172A] focus:ring-[#0F172A] disabled:opacity-50"
                />
                <span className="font-sans text-xs md:text-sm text-slate-600">
                  I am over 19 years of age
                </span>
              </label>

              {signupMutation.isError && (
                <div className="text-red-600 text-xs md:text-sm font-sans text-center mb-2 p-2 bg-red-50 border border-red-200 rounded-[4px]">
                  {signupError}
                  {canResend && (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendMutation.isPending}
                      className="mt-2 block w-full cursor-pointer font-semibold text-[#2E6BBE] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resendMutation.isPending ? 'Sending link...' : 'Resend activation link'}
                    </button>
                  )}
                  {resendMutation.isError && (
                    <p className="mt-2">{getApiErrorMessage(resendMutation.error)}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>

          {/* CARD 2: Already have an account? */}
          <div className="w-full max-w-[500px] bg-[#FFFDF9] p-8 md:p-10 rounded-[4px] shadow-2xl flex flex-col z-10">
            <h3 className="font-serif italic text-2xl md:text-[26px] font-normal text-[#0F172A] text-center mb-8 select-none">
              Already have an account?
            </h3>
            
            <form onSubmit={handleLogInSubmit} className="flex flex-col gap-4 w-full">
              <input
                type="email"
                name="email"
                required
                disabled={loginMutation.isPending}
                placeholder="Email Address"
                value={logInData.email}
                onChange={handleLogInChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                disabled={loginMutation.isPending}
                placeholder="Password"
                value={logInData.password}
                onChange={handleLogInChange}
                className="w-full bg-[#FFFDF9] border border-slate-300 focus:border-slate-500 text-slate-800 placeholder-slate-400 text-sm font-sans px-4 py-3.5 rounded-[4px] outline-none transition-all duration-200 disabled:opacity-50"
              />

              {loginMutation.isError && (
                <div className="text-red-600 text-xs md:text-sm font-sans text-center p-2 bg-red-50 border border-red-200 rounded-[4px]">
                  {getApiErrorMessage(loginMutation.error)}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 mt-4 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? 'Logging in...' : 'Log In'}
              </button>
              
              <Link
                to="/forgot-password"
                className="font-sans text-xs md:text-sm text-slate-500 text-center mt-3 hover:text-slate-800 transition-colors duration-200 underline underline-offset-4"
              >
                Forgot your Password?
              </Link>
            </form>
          </div>
        </>
      )}

    </div>
  );
}

export default Signup;