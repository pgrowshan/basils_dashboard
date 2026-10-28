import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stayBg from '../../assets/stay_bg.svg';
import OrderSummary from './OrderSummary';
import CheckoutStepper from './CheckoutStepper';

function CheckoutMain() {
  const navigate = useNavigate();
  const [shippingOption, setShippingOption] = useState(5); // Default Standard Shipping ($5.00)

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment');
  };

  return (
    <div 
      className="relative min-h-screen w-full px-4 pb-16 pt-24 md:px-8 md:pt-28 flex flex-col items-center justify-start gap-6 select-none bg-[#4372B8]"
      style={{ 
        backgroundImage: `url(${stayBg})`,
        backgroundSize: '320px 240px',
        backgroundRepeat: 'repeat'
      }}
    >
      {/* Top Navigation/Progress Stepper */}
      <CheckoutStepper active={1} />

      {/* Main Checkout Area */}
      <div className="z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-7">
        
        {/* Left Column: Form Card (shows 2nd on mobile, 1st on desktop) */}
        <form onSubmit={handleSubmit} className="order-2 flex w-full flex-col rounded-[4px] bg-[#FFFDF8] p-6 shadow-md md:p-10 lg:order-1 lg:p-12">
          <h1 className="mb-7 font-gelica text-[32px] font-normal text-[#4372B8] md:text-[36px]">
            Checkout
          </h1>

          <h2 className="font-sans text-xs tracking-widest text-[#2E6BBE] font-bold uppercase mb-6">
            Shipping Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-5">
            {/* First Name */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">First Name</label>
              <input 
                type="text" 
                required
                placeholder="First Name" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                required
                placeholder="Last Name" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full mb-5">
            <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Country/Region</label>
            <div className="relative">
              <select defaultValue="" required className="w-full cursor-pointer appearance-none border-b border-[#2E6BBE]/30 bg-transparent py-1 font-sans text-sm text-[#7AA0D4] outline-none focus:border-[#2E6BBE]">
                <option value="" disabled>Country</option>
                <option value="Canada">Canada</option>
                <option value="United States">United States</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-[#2E6BBE]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[3fr_1.2fr] gap-6 mb-5">
            {/* Address */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Address</label>
              <input 
                type="text" 
                required
                placeholder="Full Address" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>
            
            {/* Apt / Suite# */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Apt / Suite#</label>
              <input 
                type="text" 
                placeholder="Apt/Suite" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3 md:gap-6">
            {/* City */}
            <div className="col-span-2 flex w-full flex-col gap-1.5 md:col-span-1">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">City</label>
              <input 
                type="text" 
                required
                placeholder="City" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>

            {/* Province/Territory */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Province/Territory</label>
              <div className="relative">
                <select defaultValue="" required className="w-full cursor-pointer appearance-none border-b border-[#2E6BBE]/30 bg-transparent py-1 font-sans text-sm text-[#7AA0D4] outline-none focus:border-[#2E6BBE]">
                  <option value="" disabled>Province</option>
                  <option value="Ontario">Ontario</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Alberta">Alberta</option>
                  <option value="Manitoba">Manitoba</option>
                  <option value="Saskatchewan">Saskatchewan</option>
                  <option value="Nova Scotia">Nova Scotia</option>
                  <option value="New Brunswick">New Brunswick</option>
                  <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                  <option value="Prince Edward Island">Prince Edward Island</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-[#2E6BBE]">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Postal Code */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Postal Code</label>
              <input 
                type="text" 
                required
                placeholder="Postal Code" 
                className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full mb-6">
            <label className="text-xs text-[#2E6BBE] font-sans font-bold uppercase tracking-wider">Phone Number</label>
            <input 
              type="tel" 
              placeholder="Phone (Optional)" 
              className="border-b border-[#2E6BBE]/40 focus:border-[#2E6BBE] outline-none py-1 text-sm bg-transparent text-slate-800 placeholder-[#2E6BBE]/40 font-sans" 
            />
          </div>

          <label className="flex items-center gap-3 mb-10 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-sm border border-[#4372B8] accent-[#4372B8]"
            />
            <span className="font-sans text-xs font-bold text-[#2E6BBE] tracking-wider uppercase">
              Different Billing Address?
            </span>
          </label>

          <h2 className="font-sans text-xs tracking-widest text-[#2E6BBE] font-bold uppercase mb-4">
            Shipping Options
          </h2>
          
          <div className="border-y border-[#2E6BBE]/20 divide-y divide-[#2E6BBE]/20 mb-8">
            {/* Option 1: Standard Shipping */}
            <label className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex flex-col">
                <span className="font-sans text-sm font-bold text-[#2E6BBE]">Standard Shipping — $5.00</span>
                <span className="font-sans text-xs text-[#2E6BBE]/60">Estimated Delivery 5-7 days</span>
              </div>
              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${shippingOption === 5 ? "border-[#4372B8]" : "border-[#8AADD6]"}`}>
                {shippingOption === 5 && <span className="h-2.5 w-2.5 rounded-full bg-[#4372B8]" />}
              </span>
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingOption === 5}
                onChange={() => setShippingOption(5)}
                className="sr-only"
              />
            </label>

            {/* Option 2: Express Shipping */}
            <label className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex flex-col">
                <span className="font-sans text-sm font-bold text-[#2E6BBE]">Express Shipping — $20.00</span>
                <span className="font-sans text-xs text-[#2E6BBE]/60">Estimated Delivery 3 days</span>
              </div>
              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${shippingOption === 20 ? "border-[#4372B8]" : "border-[#8AADD6]"}`}>
                {shippingOption === 20 && <span className="h-2.5 w-2.5 rounded-full bg-[#4372B8]" />}
              </span>
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingOption === 20}
                onChange={() => setShippingOption(20)}
                className="sr-only"
              />
            </label>
          </div>

          <label className="flex items-start gap-3 mb-8 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border border-[#4372B8] accent-[#4372B8]"
            />
            <span className="font-sans text-xs font-medium text-[#2E6BBE]/80 leading-relaxed">
              I'm aware of the laws regarding purchase and possession of psilocybin in my province.
            </span>
          </label>

          <button
            type="submit"
            className="w-full cursor-pointer self-start bg-[#3E6EAE] px-12 py-3.5 text-center font-['Circe'] text-[15px] font-medium text-white transition-colors hover:bg-[#355f98] lg:w-fit"
          >
            Continue to Payment
          </button>
        </form>

        {/* Right Column: Order Summary Component (shows 1st on mobile, 2nd on desktop) */}
        <OrderSummary shippingOption={shippingOption} />

      </div>
    </div>
  );
}

export default CheckoutMain;
