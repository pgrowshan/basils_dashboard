import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import blueberry from "../../assets/BlueberryCard.png";
import hazelnut from "../../assets/HazelnutCard.png";
import strawberry from "../../assets/StrawberryCard.png";

const cardTitleBase =
  "text-center font-gelica text-[22px] sm:text-[26px] md:text-[28px] lg:text-[32.419px] font-semibold leading-snug sm:leading-normal px-3 sm:px-4";

const cardData = [
  {
    id: 1,
    title: "Strawberry White Chocolate",
    textStyle: `text-[#E41E26] ${cardTitleBase}`,
    bgImg: strawberry,
  },
  {
    id: 2,
    title: "Blueberry Dark Chocolate",
    textStyle: `text-[#F8ECB7] ${cardTitleBase}`,
    bgImg: blueberry,
  },
  {
    id: 3,
    title: "Hazelnut Milk Chocolate",
    textStyle: `text-[#FDDBCA] ${cardTitleBase}`,
    bgImg: hazelnut,
  },
];

function StarterCard({ card, className = "", interactive = false }) {
  return (
    <div
      className={`relative group cursor-pointer overflow-hidden rounded-lg shadow-lg aspect-[3/4] ${className}`}
    >
      <img
        src={card.bgImg}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
      />

      <div
        className={`absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8 pointer-events-none transition-opacity duration-300 ${
          interactive ? "lg:group-hover:opacity-0" : ""
        }`}
      >
        <p className={card.textStyle}>{card.title}</p>
      </div>

      {interactive && (
        <div className="absolute inset-0 hidden lg:flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-full max-w-[260px] space-y-4 flex flex-col items-center justify-center">
            <button className="w-full bg-white text-[#4372B8] text-center py-3.5 px-6 rounded-xl font-medium text-lg shadow-sm">
              3g Microdose Bar
            </button>
            <button className="w-full bg-white text-[#4372B8] text-center py-3.5 px-6 rounded-xl font-medium text-lg shadow-sm">
              6g Macrodose Bar
            </button>
          </div>
          <h3 className={`mt-10 ${card.textStyle}`}>{card.title}</h3>
        </div>
      )}
    </div>
  );
}

const PROGRESS_TRACK_WIDTH = 200;
const PROGRESS_THUMB_WIDTH = 64;

function Starter() {
  const sliderRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return (
    <section className="bg-[#FDFBF7] py-12 sm:py-16 md:py-24 px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col gap-6 sm:gap-8 items-center justify-center mb-10 sm:mb-12 lg:mb-16 w-full">
          <h2 className="text-[#0F172A] text-center font-['Gelica'] text-[40px] md:text-[48px] font-semibold leading-tight md:leading-normal w-full max-w-[349px] lg:max-w-[828px]">
            Pick Your Chocolate Starter
          </h2>

          <p className="text-[#0F172A] text-center font-['Circe'] text-[18px] md:text-[20px] font-normal leading-normal w-full max-w-[349px] lg:max-w-[764px]">
            Find the flavour that best matches your mind, gut and soul's
            craving.
          </p>
        </div>

        {/* Carousel: mobile & tablet */}
        <div className="lg:hidden w-full mb-8">
          <div
            ref={sliderRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory -mx-6 px-6 pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cardData.map((card) => (
              <StarterCard
                key={card.id}
                card={card}
                className="flex-shrink-0 w-[calc(100vw-88px)] md:w-[calc(50vw-56px)] max-w-[371px] snap-center"
              />
            ))}
          </div>

          <div
            className="h-[4px] bg-[#D1E1F0] mx-auto mt-8 relative overflow-hidden rounded-full"
            style={{ width: `${PROGRESS_TRACK_WIDTH}px` }}
            aria-hidden="true"
          >
            <div
              className="absolute top-0 bottom-0 bg-[#4372B8] rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${PROGRESS_THUMB_WIDTH}px`,
                left: `${scrollProgress * (PROGRESS_TRACK_WIDTH - PROGRESS_THUMB_WIDTH)}px`,
              }}
            />
          </div>
        </div>

        {/* Grid: large screens */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8 w-full max-w-6xl mb-12 lg:mb-16">
          {cardData.map((card) => (
            <StarterCard
              key={card.id}
              card={card}
              className="w-full"
              interactive
            />
          ))}
        </div>

        <Link
          to="/chocolates"
          className="bg-white border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-sans font-semibold text-xs md:text-sm tracking-[0.25em] uppercase px-12 py-4 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Shop All
        </Link>
      </div>
    </section>
  );
}

export default Starter;
