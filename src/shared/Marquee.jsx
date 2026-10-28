import FastMarquee from 'react-fast-marquee';

// Extract the actual component to handle ESM/CommonJS default export nesting in Vite
const MarqueeComponent = FastMarquee?.default || FastMarquee;

function Marquee() {
  const items = [
    "Bars",
    "Handcrafted",
    "Intentional",
    "Microdosing Bars",
    "Delish",
    "Macrodosing Bars",
    "Bars",
    "Handcrafted",
    "Intentional",
    "Microdosing Bars",
    "Delish",
    "Macrodosing Bars"
  ];

  return (
    <div className="bg-[#0B1320] py-3.5 border-y border-white/5 select-none overflow-hidden font-sans text-xs md:text-sm tracking-[0.25em] font-semibold text-gold-cream uppercase">
      <MarqueeComponent speed={60} gradient={false}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center whitespace-nowrap">
            <span className="mx-8">{item}</span>
            <span className="text-sky-300/80 text-[10px] md:text-xs">✦</span>
          </div>
        ))}
      </MarqueeComponent>
    </div>
  );
}

export default Marquee;