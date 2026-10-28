import { Link } from "react-router-dom";
import startPieces from "../../assets/start-peaces.svg";

function Journey() {
  return (
    <section className="bg-[#FDFBF7] px-4 py-12 select-none sm:px-6 sm:py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 rounded-3xl bg-[#F8ECB7] p-6 shadow-sm sm:gap-10 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-12 md:p-12 lg:p-16">
          <div className="flex w-full flex-col items-start text-left md:w-1/2 md:max-w-[460px]">
            <span className="font-['Circe'] text-xs font-normal uppercase tracking-[0.14em] text-[#4372B8] sm:text-sm md:text-[15px]">
              Your dosing guide
            </span>

            <h2 className="mt-3 max-w-[16rem] font-gelica text-[32px] font-semibold leading-[1.15] text-[#4372B8] sm:max-w-none sm:text-[40px] md:mt-4 md:text-[48px] md:leading-[1.12]">
              Not sure where
              <br />
              to start?
            </h2>

            <p className="mt-4 max-w-[420px] font-['Circe'] text-[15px] font-normal leading-relaxed text-[#4372B8] sm:text-[16px] md:mt-5 md:text-[17px]">
              No worries, we are here to help. Remember, the “right dose” is a personal question, not a number we hand you.
            </p>

            <Link
              to="/start-here"
              className="mt-6 flex h-11 w-full items-center justify-center rounded-[4px] border-2 border-[#4372B8] bg-white px-8 font-['Circe'] text-[15px] font-normal text-[#4372B8] transition-colors duration-300 hover:bg-[#4372B8] hover:text-white sm:h-12 sm:w-auto sm:min-w-[180px] sm:text-[16px] md:mt-8"
            >
              Check it Out
            </Link>
          </div>

          <div className="flex w-full justify-center md:w-1/2">
            <img
              src={startPieces}
              alt="Broken pieces of a strawberry white chocolate bar"
              className="h-auto w-full max-w-[420px] md:max-w-[471px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Journey;
