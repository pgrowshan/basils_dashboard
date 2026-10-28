import { useRef, useState, useEffect } from 'react';

// Default data for when the API is not yet integrated
const defaultData = [
  { id: 1, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
  { id: 2, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
  { id: 3, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
  { id: 4, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
  { id: 5, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
  { id: 6, title: '3g Blueberry Dark Chocolate', category: 'MICRODOSE', price: '$65', image: 'https://via.placeholder.com/400x400?text=Product+Image' },
];

const Veteran = ({ data = defaultData }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(Math.ceil(scrollLeft) > 1);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);

      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [data]); // re-run checkScroll if data changes

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-[#fdfcfa]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <p className="text-[11px] md:text-xs tracking-[0.25em] text-[#555] uppercase mb-4 font-sans font-medium">
            <span className="hidden md:inline">Are you a mushroom veteran?</span>
            <span className="md:hidden">Experienced?</span>
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-gelica font-bold text-[#142340] mb-4 md:mb-6 tracking-tight">
            Need a little more umph?
          </h2>
          <p className="text-[#3b414f] font-sans text-sm md:text-base px-2 max-w-[280px] md:max-w-none mx-auto leading-relaxed">
            Our 6g Bars will do the trick. Each bar is dosed intentionally.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop Navigation & Shop All */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`p-1 transition-colors ${
                  canScrollLeft
                    ? 'text-[#446597] hover:text-[#2d466e] cursor-pointer'
                    : 'text-[#bad1ed] cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`p-1 transition-colors ${
                  canScrollRight
                    ? 'text-[#446597] hover:text-[#2d466e] cursor-pointer'
                    : 'text-[#bad1ed] cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            <a
              href="#"
              className="text-[#446597] hover:text-[#2d466e] font-sans font-semibold text-sm underline underline-offset-[5px] transition-colors"
            >
              Shop All
            </a>
          </div>

          {/* Cards */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4"
          >
            {data.map((product) => (
              <div key={product.id} className="min-w-[260px] md:min-w-[320px] lg:min-w-[350px] snap-start flex-shrink-0 cursor-pointer group">
                {/* Product Image */}
                <div className="w-full aspect-square bg-[#d9d9d9] mb-4 md:mb-5 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-[#d9d9d9]"></div>
                  )}
                </div>
                
                <h3 className="font-sans font-bold text-[#1a1a1a] text-[16px] md:text-[17px] mb-1 md:mb-2 group-hover:text-[#446597] transition-colors">
                  {product.title}
                </h3>
                <p className="font-sans text-[10px] md:text-[11px] text-[#6b6b6b] uppercase tracking-[0.1em] mb-3">
                  {product.category}
                </p>
                <div className="flex justify-between items-end">
                  <p className="font-sans font-bold text-[#1a1a1a] text-[14px] md:text-[15px]">
                    {product.price}
                  </p>
                  
                  {/* Shopping Bag Icon with Plus */}
                  <button className="text-[#142340] hover:text-[#446597] transition-colors" aria-label="Add to cart">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 6V7H4.5C3.67157 7 3 7.67157 3 8.5V20.5C3 21.3284 3.67157 22 4.5 22H14.171C14.0601 21.6828 14 21.3475 14 21C14 17.6863 16.6863 15 20 15C20.3475 15 20.6828 15.0601 21 15.171V8.5C21 7.67157 20.3284 7 19.5 7H16V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6ZM10 7V6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6V7H10Z" fill="currentColor"/>
                      <circle cx="19" cy="19" r="4.5" fill="white" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M19 16.5V21.5M16.5 19H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Custom Scroll Progress Bar */}
          <div className="w-[150px] md:w-[200px] mx-auto mt-4 md:mt-6 h-1.5 bg-[#bad1ed] rounded-full relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[#446597] rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: '50%',
                left: `${scrollProgress / 2}%`, 
              }}
            />
          </div>

          {/* Mobile Shop All */}
          <div className="mt-8 text-center md:hidden">
            <a
              href="#"
              className="text-[#446597] hover:text-[#2d466e] font-sans font-semibold text-sm underline underline-offset-[5px] transition-colors"
            >
              Shop All
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Veteran;
