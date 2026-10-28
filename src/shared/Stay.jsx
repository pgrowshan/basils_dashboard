import { useState } from 'react';
import stayBg from '../assets/stay_bg.svg';

function Stay() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  return (
    <section className="relative bg-[#2E6BBE] text-white py-20 px-6 select-none overflow-hidden border-t border-white/5">
      
      {/* Background Pattern Layer using the imported SVG file */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-100 bg-repeat"
        style={{ 
          backgroundImage: `url(${stayBg})`,
          backgroundSize: '320px 240px'
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Title using custom Gelica font */}
        <h2 className="font-gelica text-4xl md:text-5xl lg:text-[54px] font-normal text-white tracking-tight mb-4 select-none">
          Stay in the loop
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-xs md:text-sm text-white/90 font-medium tracking-wide mb-10 select-none opacity-90">
          Get the latest on new flavors and sweet surprises
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-[620px] mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full sm:flex-grow bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/20 focus:border-white/50 text-white placeholder-white/50 text-sm font-sans tracking-wide px-5 py-3.5 rounded-[4px] outline-none transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#FFFDF9] hover:bg-[#F9F6F0] text-[#2E6BBE] font-sans font-semibold text-sm px-9 py-3.5 rounded-[4px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-md select-none border border-transparent"
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}

export default Stay;
