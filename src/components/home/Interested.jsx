import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import hazelnut from "../../assets/cake/cake-1.svg";
import strawberry from "../../assets/cake/cake-2.svg";
import blueberry from "../../assets/cake/cake-3.svg";

const products = [
  {
    id: "blueberry",
    name: "3g Blueberry Dark Chocolate",
    image: blueberry,
    slug: "blueberry-dark",
  },
  {
    id: "strawberry",
    name: "3g Strawberry White Chocolate",
    image: strawberry,
    slug: "strawberry-white",
  },
  {
    id: "hazelnut",
    name: "3g Hazelnut Milk Chocolate",
    image: hazelnut,
    slug: "hazelnut-milk",
  },
];

const slides = [...products, ...products];

function Interested() {
  const sliderRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateProgress = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const next = maxScroll > 0 ? slider.scrollLeft / maxScroll : 0;
    setProgress(next);
    setCanLeft(slider.scrollLeft > 4);
    setCanRight(slider.scrollLeft < maxScroll - 4);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    updateProgress();
    slider.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      slider.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.querySelector("[data-card]");
    const gap = 24;
    const amount = (card?.clientWidth || 320) + gap;
    slider.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#FDFBF7] px-4 py-12 select-none sm:px-6 md:px-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-gelica text-[32px] font-semibold leading-tight text-[#0F172A] sm:text-4xl md:text-[48px]">
            Interested in Microdosing?
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-['Circe'] text-[15px] leading-relaxed text-[#1E293B] sm:text-base md:text-[17px]">
            Our 3g bars are the perfect companion. 125mg × 24 pieces = 3g of dried psilocybe cubensis per bar
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between md:mt-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canLeft}
              aria-label="Previous bars"
              className="flex h-9 w-9 items-center justify-center text-[#3b6eba] transition-opacity disabled:opacity-30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canRight}
              aria-label="Next bars"
              className="flex h-9 w-9 items-center justify-center text-[#3b6eba] transition-opacity disabled:opacity-30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <Link
            to="/chocolates"
            className="font-['Circe'] text-[15px] text-[#3b6eba] transition-colors hover:text-[#2f5a9e] sm:text-base"
          >
            Shop All
          </Link>
        </div>

        <div
          ref={sliderRef}
          className="scrollbar-none mt-4 flex gap-4 overflow-x-auto pb-2 md:mt-6 md:gap-6"
        >
          {slides.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              data-card
              to={`/chocolates/${product.slug}`}
              className="w-[78%] shrink-0 sm:w-[46%] lg:w-[31%]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[375/417] h-auto w-full bg-white object-contain"
              />
              <h3 className="mt-4 font-['Circe'] text-[16px] font-semibold leading-snug text-[#0F172A] sm:text-[17px]">
                {product.name}
              </h3>
              <p className="mt-1 font-['Circe'] text-[11px] font-medium uppercase tracking-[0.16em] text-[#334155]">
                Microdose
              </p>
              <p className="mt-2 font-['Circe'] text-[16px] font-semibold text-[#0F172A]">
                $65.00
              </p>
            </Link>
          ))}
        </div>

        <div className="mx-auto mt-8 h-[3px] w-36 overflow-hidden rounded-full bg-[#d6e4f4] md:mt-10">
          <div
            className="h-full rounded-full bg-[#3b6eba] transition-[width] duration-150"
            style={{ width: `${Math.round(34 + progress * 66)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default Interested;
