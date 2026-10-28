import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyRegistration } from '../hooks/auth/useVerifyRegistration.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import stayBg from '../assets/stay_bg.svg';

function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const purpose = searchParams.get('purpose');

  // Prevent double execution of mutation in React Strict Mode (dev)
  const mutationCalled = useRef(false);

  const verifyMutation = useVerifyRegistration();

  useEffect(() => {
    if (!token || !purpose) return;
    if (mutationCalled.current) return;

    mutationCalled.current = true;
    verifyMutation.mutate({ token, purpose }, {
      onSuccess: () => {
        window.setTimeout(() => navigate('/'), 2000);
      },
    });
  }, [token, purpose, verifyMutation, navigate]);

  const handleGoHome = () => {
    navigate('/');
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
      <div className="w-full max-w-[500px] bg-[#FFFDF9] p-8 md:p-10 rounded-[4px] shadow-2xl flex flex-col items-center justify-center text-center z-10">
        
        {verifyMutation.isPending && (
          <>
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0F172A] rounded-full animate-spin mb-6"></div>
            <h2 className="font-gelica text-2xl md:text-[28px] font-normal text-[#0F172A] mb-4 select-none">
              Verifying Your Account
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-600 mb-2 leading-relaxed">
              Please wait while we activate your account...
            </p>
          </>
        )}

        {verifyMutation.isSuccess && (
          <>
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="font-gelica text-2xl md:text-[28px] font-normal text-green-700 mb-4 select-none">
              Verification Successful!
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-800 mb-8 leading-relaxed">
              {verifyMutation.data?.message || 'Your account has been activated successfully.'}
            </p>
            <button
              onClick={handleGoHome}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent"
            >
              Go to Home Page
            </button>
          </>
        )}

        {verifyMutation.isError && (
          <>
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="font-gelica text-2xl md:text-[28px] font-normal text-red-700 mb-4 select-none">
              Verification Failed
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-800 mb-8 leading-relaxed">
              {getApiErrorMessage(verifyMutation.error)}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent"
            >
              Back to Sign Up / Log In
            </button>
          </>
        )}

        {(!token || !purpose) && !verifyMutation.isPending && !verifyMutation.isSuccess && !verifyMutation.isError ? (
          <>
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="font-gelica text-2xl md:text-[28px] font-normal text-[#0F172A] mb-4 select-none">
              Invalid Request
            </h2>
            <p className="font-sans text-sm md:text-base text-slate-600 mb-8 leading-relaxed">
              Missing token or purpose configuration parameters. Please check your verification link.
            </p>
            <button
              onClick={handleGoHome}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-semibold text-sm py-3.5 rounded-[4px] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-md select-none border border-transparent"
            >
              Go to Home Page
            </button>
          </>
        ) : null}

      </div>
    </div>
  );
}

export default Verify;
