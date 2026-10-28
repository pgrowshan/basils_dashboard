import frame from "../../assets/WhatMakes/Frame 703.svg";

const points = [
  {
    id: "quality",
    title: "High Quality",
    heading: "Craft Grown Mushrooms",
    description:
      "We are selective of the mushrooms we source. We pick the strains that are potent and right for the product we want to make and make sure they’re grown naturally to the highest standards. Always hand-trimmed, and potency-tested.",
  },
  {
    id: "flavour",
    title: "Phenomenal",
    heading: "Ingredients & Flavour",
    description:
      "Deeply connected to the earth, we consider ourselves part of it. We strive to formulate our products with ingredients you recognize and can count with one hand. Plus, good ingredients makes for great flavour. One bite into the chocolate you know a second is coming.",
  },
  {
    id: "delivery",
    title: "Discreet",
    heading: "Delivery",
    description:
      "Our unmarked packages provide no hints as to what's inside, ensuring discreet delivery. We use, Purolator, UPS or CanadaPost Xpressspost for fast and reliable shipping.",
  },
];

function WhatMakes() {
  return (
    <section className="bg-[#FDFBF7] px-4 py-14 select-none sm:px-6 md:px-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-gelica text-[32px] font-semibold leading-tight text-[#0F172A] sm:text-4xl lg:text-[52px]">
          What makes us sooo good?
        </h2>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:mt-20 lg:grid-cols-[minmax(280px,520px)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <img
            src={frame}
            alt="Blueberry dark chocolate bar with blueberries and pieces of chocolate"
            className="mx-auto h-auto w-full max-w-[420px] lg:max-w-none"
          />

          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
            {points.map((item) => (
              <div key={item.id}>
                <p className="font-['Circe'] text-[12px] font-medium uppercase tracking-[0.18em] text-[#1E293B] sm:text-[13px]">
                  {item.title}
                </p>
                <h3 className="mt-2 font-gelica text-[26px] font-semibold leading-tight text-[#0F172A] sm:text-[30px]">
                  {item.heading}
                </h3>
                <p className="mt-3 max-w-xl font-['Circe'] text-[15px] leading-relaxed text-[#334155] sm:text-[16px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatMakes;
