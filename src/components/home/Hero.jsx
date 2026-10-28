import heroBg from '../../assets/hero.svg'
import heroMobile from '../../assets/hero-mobile.svg'
import { Link } from 'react-router'

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#4c76b4] select-none">
      <img
        src={heroMobile}
        alt=""
        className="block h-auto w-full md:mx-auto md:h-[100svh] md:w-auto md:max-w-full lg:hidden"
      />
      <img
        src={heroBg}
        alt=""
        className="hidden h-[100svh] w-full object-cover object-center lg:block"
      />

      <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pt-24 text-center sm:pt-28 md:px-12 md:pt-32 lg:inset-0 lg:justify-center lg:px-12 lg:pt-0 lg:items-start lg:text-left">
        <div className="w-full max-w-xl lg:max-w-2xl">
          <p className="mb-3 hidden max-w-[506px] font-['Circe'] text-[18px] font-normal uppercase leading-normal text-[#FFFAF4] lg:block">
            Small Batch · hand crafted · decadent
          </p>

          <h1 className="mx-auto max-w-[20rem] font-gelica text-[clamp(1.85rem,8vw,2.5rem)] font-semibold leading-[1.12] text-[#FFFAF4] sm:max-w-md sm:text-5xl md:max-w-2xl md:text-[3.25rem] md:leading-[1.08] lg:mx-0 lg:max-w-[611px] lg:text-[58px] xl:text-[68px] xl:leading-normal">
            The Gift for your
            <br className="lg:hidden" />
            Soul is Here.
          </h1>

          <p className="mx-auto mt-3 max-w-[20.5rem] font-['Circe'] text-[15px] font-normal leading-snug text-[#FFFAF4] sm:mt-4 sm:max-w-md sm:text-[18px] sm:leading-relaxed md:max-w-[34rem] md:text-[20px] lg:mx-0 lg:mt-4 lg:w-[546px] lg:max-w-none lg:text-[22px] lg:leading-normal">
            Each bar is crafted to nourish both body and soul.
            Discover the difference that real ingredients and genuine care can make.
          </p>

          <div className="mx-auto mt-5 flex w-full max-w-[22rem] items-center justify-center gap-3 sm:mt-7 sm:max-w-none sm:gap-5 lg:mx-0 lg:justify-start">
            <Link
              to="/chocolates"
              className="flex h-11 flex-1 items-center justify-center rounded-[2px] bg-[#F8ECB7] px-4 text-[15px] text-[#1E110A] sm:h-12 sm:flex-none sm:w-[150px] sm:px-6"
            >
              Shop
            </Link>
            <Link
              to="/our-mission"
              className="flex h-11 flex-1 items-center justify-center rounded-[2px] border-2 border-solid border-[#FFFAF4] px-4 text-[15px] text-white transition-colors duration-300 hover:bg-white hover:text-black sm:h-12 sm:flex-none sm:w-[156px] sm:px-6"
            >
              Our Mission
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
