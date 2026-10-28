import { useState } from 'react';

const benefits = [
  {
    id: "creativity",
    label: "Boosts",
    title: "Creativity",
    description: "Psilocybin activates your brain and awakens your innate creativity. Microdosing can significantly enhance your problem-solving skills, allowing you to discover unique and effective approaches to situations that you may not have realized before."
  },
  {
    id: "focus",
    label: "Increase",
    title: "Focus & Concentration",
    description: "By tuning out distractions and regulating neural pathways, microdosing helps sustain deep cognitive focus. Enjoy calm, steady attention spans that keep you productive throughout the day without the jitters."
  },
  {
    id: "stress",
    label: "Lowers",
    title: "Anxiety & Stress",
    description: "Experience a gentle leveling of emotional highs and lows. Microdosing supports a calm nervous system, lowering daily stress levels and helping you navigate challenging moments with quiet ease."
  },
  {
    id: "mood",
    label: "Improves",
    title: "Mood & Connection",
    description: "Awaken a warm sense of empathy and connectedness to the world around you. Many find that microdosing lifts the spirit, encourages authentic conversations, and deepens interpersonal bonds."
  },
  {
    id: "energy",
    label: "Boosts",
    title: "Energy",
    description: "Unlock a clean, natural vitality that flows from within. Microdosing offers a subtle physical and mental lift, boosting overall stamina and refreshing your daily drive without sleep disruption."
  }
];

function Microdosing() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Render organic abstract animations matching the active benefit
  const renderVisual = () => {
    switch (benefits[activeIdx].id) {
      case 'creativity':
        return (
          <svg viewBox="0 0 200 200" className="w-32 h-32 text-slate-700 animate-[spin_25s_infinite_linear]">
            <path fill="currentColor" d="M43.2,-58.5C55.4,-51.2,64.3,-38.3,71.2,-23.7C78.1,-9.1,83,7.3,78.3,20.8C73.6,34.3,59.3,44.9,45.4,54C31.5,63.1,15.8,70.7,0.3,70.3C-15.2,69.9,-30.3,61.5,-42.6,51.4C-54.9,41.2,-64.3,29.3,-69,15C-73.6,0.7,-73.4,-16.1,-66.6,-30C-59.8,-43.8,-46.3,-54.6,-32.4,-60.9C-18.4,-67.2,-4.2,-69,9.4,-66.3C23,-63.7,31.1,-65.7,43.2,-58.5Z" transform="translate(100 100)" />
          </svg>
        );
      case 'focus':
        return (
          <svg viewBox="0 0 200 200" className="w-32 h-32 text-slate-700">
            <circle cx="100" cy="100" r="10" fill="currentColor" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
          </svg>
        );
      case 'stress':
        return (
          <svg viewBox="0 0 200 200" className="w-32 h-32 text-slate-700">
            <path d="M10 80 Q 50 110, 90 80 T 170 80 T 250 80" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[pulse_2s_infinite]" />
            <path d="M10 100 Q 50 130, 90 100 T 170 100 T 250 100" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <path d="M10 120 Q 50 150, 90 120 T 170 120 T 250 120" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          </svg>
        );
      case 'mood':
        return (
          <svg viewBox="0 0 200 200" className="w-32 h-32 text-slate-700">
            <circle cx="100" cy="70" r="16" fill="currentColor" />
            <circle cx="60" cy="130" r="12" fill="currentColor" />
            <circle cx="140" cy="130" r="12" fill="currentColor" />
            <line x1="100" y1="70" x2="60" y2="130" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="70" x2="140" y2="130" stroke="currentColor" strokeWidth="2" />
            <line x1="60" y1="130" x2="140" y2="130" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="100" cy="70" r="24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
        );
      case 'energy':
        return (
          <svg viewBox="0 0 200 200" className="w-32 h-32 text-slate-700">
            <path d="M100 20 L100 45 M100 155 L100 180 M20 100 L45 100 M155 100 L180 100 M43.4 43.4 L61.1 61.1 M138.9 138.9 L156.6 156.6 M43.4 156.6 L61.1 138.9 M138.9 61.1 L156.6 43.4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-[pulse_1.5s_infinite]" />
            <circle cx="100" cy="100" r="25" fill="currentColor" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative bg-[#2E6BBE] text-white py-16 md:py-24 lg:py-32 px-6 md:px-8 lg:px-16 select-none overflow-hidden border-t border-white/5">
      
      {/* Decorative Double Inset Borders */}
      <div className="absolute inset-4 md:inset-6 border border-white/30 pointer-events-none" />
      <div className="absolute inset-6 md:inset-9 border border-white/30 pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        
        {/* ========================================== */}
        {/* DESKTOP LAYOUT (lg:grid, hidden on mobile) */}
        {/* ========================================== */}
        <div className="hidden lg:grid grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Title and Benefits List */}
          <div className="flex flex-col gap-12">
            <h2 className="font-gelica text-5xl font-normal text-white mb-4 select-none">
              Benefits of Microdosing
            </h2>
            
            <div className="flex flex-col gap-8">
              {benefits.map((benefit, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <div
                    key={benefit.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex items-start gap-4 cursor-pointer group transition-all duration-300 transform ${
                      isActive ? 'translate-x-12' : 'translate-x-0'
                    }`}
                  >
                    {/* Chevron arrow */}
                    <span 
                      className={`transition-colors duration-300 mt-1 shrink-0 ${
                        isActive ? 'text-[#F9EBB4]' : 'text-white/60 group-hover:text-[#F9EBB4]'
                      }`}
                    >
                      <svg className="w-4 h-4 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                    
                    {/* Category & Title */}
                    <div className="flex flex-col gap-0.5">
                      <span 
                        className={`font-serif italic text-[14px] leading-none select-none transition-colors duration-300 ${
                          isActive ? 'text-[#F9EBB4]' : 'text-white/60 group-hover:text-[#F9EBB4]'
                        }`}
                      >
                        {benefit.label}
                      </span>
                      <span 
                        className={`font-serif italic text-[22px] font-medium leading-tight transition-colors duration-300 ${
                          isActive ? 'text-[#F9EBB4]' : 'text-white group-hover:text-[#F9EBB4]'
                        }`}
                      >
                        {benefit.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Graphic & Dynamic Description */}
          <div className="flex flex-col items-end">
            {/* Visual illustration box */}
            <div className="w-full max-w-[360px] aspect-square bg-[#D8D8D8] rounded-[4px] relative overflow-hidden flex items-center justify-center shadow-lg border border-white/5">
              {renderVisual()}
            </div>

            {/* Dynamic Description Text */}
            <p className="font-sans text-[15px] text-white/80 leading-relaxed max-w-[360px] mt-6 select-text transition-all duration-300 ease-in-out">
              {benefits[activeIdx].description}
            </p>
          </div>
        </div>

        {/* ========================================== */}
        {/* MOBILE LAYOUT (block, hidden on desktop)  */}
        {/* ========================================== */}
        <div className="block lg:hidden flex flex-col items-stretch">
          
          {/* Centered Title */}
          <h2 className="font-gelica text-3xl font-normal text-white text-center mb-10 select-none leading-tight">
            Benefits of<br />Microdosing
          </h2>

          {/* Active Benefit Detail Block */}
          <div className="flex flex-col items-start px-2 mb-8">
            <div className="flex items-start gap-4 transform translate-x-4">
              {/* Active Chevron arrow */}
              <span className="text-[#F9EBB4] mt-1 shrink-0">
                <svg className="w-3.5 h-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
              
              {/* Active Category & Title */}
              <div className="flex flex-col gap-0.5">
                <span className="font-serif italic text-xs leading-none text-[#F9EBB4] select-none">
                  {benefits[activeIdx].label}
                </span>
                <span className="font-serif italic text-lg font-medium leading-tight text-[#F9EBB4]">
                  {benefits[activeIdx].title}
                </span>
              </div>
            </div>

            {/* Active Description Text */}
            <p className="font-sans text-xs text-white/85 leading-relaxed mt-5 select-text">
              {benefits[activeIdx].description}
            </p>

            {/* Active Graphic Illustration Box (Taller rectangle layout for mobile) */}
            <div className="w-full aspect-[4/5] bg-[#D8D8D8] rounded-[4px] mt-6 relative overflow-hidden flex items-center justify-center shadow-lg border border-white/5">
              {renderVisual()}
            </div>
          </div>

          {/* Inactive Benefits List */}
          <div className="flex flex-col gap-6 mt-10 pt-8 border-t border-white/15 px-2">
            {benefits.map((benefit, idx) => {
              if (idx === activeIdx) return null; // Only show inactive ones
              return (
                <div
                  key={benefit.id}
                  onClick={() => setActiveIdx(idx)}
                  className="flex items-start gap-4 cursor-pointer group transition-all duration-300 transform translate-x-0"
                >
                  {/* Chevron arrow */}
                  <span className="text-white/60 group-hover:text-[#F9EBB4] transition-colors duration-300 mt-1 shrink-0">
                    <svg className="w-3.5 h-3.5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                  
                  {/* Category & Title */}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-serif italic text-xs leading-none text-white/60 group-hover:text-[#F9EBB4]/80 transition-colors duration-300 select-none">
                      {benefit.label}
                    </span>
                    <span className="font-serif italic text-lg font-medium leading-tight text-white group-hover:text-[#F9EBB4] transition-colors duration-300">
                      {benefit.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

export default Microdosing;