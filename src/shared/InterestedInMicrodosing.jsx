import { useState } from "react";
import banner from "../assets/InterestedInMicrodosing/banner.svg";
import fillIcon from "../assets/InterestedInMicrodosing/fill.svg";
import outlineIcon from "../assets/InterestedInMicrodosing/outline.svg";

const benefits = [
  {
    id: "treatment-resistant",
    title: "Improving treatment-resistant depression",
    description:
      "The most extensively researched application. Multiple randomized controlled trials, administered with psychological support, show rapid reductions in depressive symptoms, with some data suggesting benefits sustained for six months or longer.",
  },
  {
    id: "mdd",
    title: "Treating Major Depressive Disorder (Non-Treatment-Resistant)",
    description:
      "Studies also look at psilocybin-assisted therapy for major depressive disorder beyond treatment-resistant cases. Sessions are paired with psychological support, and researchers follow changes in mood over the months after treatment.",
  },
  {
    id: "end-of-life",
    title: "Alleviating End-Of-Life Anxiety",
    description:
      "Research with people facing serious illness explores whether supported psilocybin sessions can ease end-of-life anxiety and distress, with careful screening and therapeutic care throughout.",
  },
  {
    id: "creativity",
    title: "Increasing Feelings of Creativity and Insight",
    description:
      "In supervised studies, participants often describe a wider sense of creativity, perspective, and personal insight. Researchers study these experiences as part of a supported session.",
  },
  {
    id: "addiction",
    title: "Combatting Substance Use and Addiction",
    description:
      "Early clinical work is examining psilocybin-assisted therapy as a support for people changing patterns of substance use, always alongside structured psychological care.",
  },
];

function InterestedInMicrodosing() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeBenefit = benefits[activeIdx];

  return (
    <section className="bg-[#4372B8] px-4 py-10 select-none sm:px-6 sm:py-12 md:px-10 md:py-16 lg:px-16">
      <div className="relative mx-auto max-w-6xl border border-[#F4FBFF] p-2 sm:p-3 md:p-4">
        <div className="border border-[#F4FBFF] px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
          <h2 className="text-center font-gelica text-[30px] font-semibold leading-tight text-[#FFFAF4] sm:text-4xl md:text-5xl lg:text-[52px]">
            Studied Benefits of Psilocybin
          </h2>

          <div className="mt-8 grid items-center gap-8 md:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,504px)] lg:gap-14 xl:gap-16">
            <div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
              {benefits.map((benefit, idx) => {
                const isActive = activeIdx === idx;
                return (
                  <button
                    key={benefit.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    aria-pressed={isActive}
                    className="group flex items-start gap-3 text-left sm:gap-4"
                  >
                    <img
                      src={isActive ? fillIcon : outlineIcon}
                      alt=""
                      className="mt-0.5 h-7 w-7 shrink-0 sm:h-8 sm:w-8"
                    />
                    <span
                      className={`font-['Circe'] text-[16px] font-medium leading-snug transition-colors duration-200 sm:text-[18px] md:text-[20px] ${
                        isActive
                          ? "text-[#F8ECB7]"
                          : "text-[#FFFAF4] group-hover:text-[#F8ECB7]"
                      }`}
                    >
                      {benefit.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="w-full">
              <img
                src={banner}
                alt="A person opening curtains toward a sunset"
                className="h-auto w-full"
              />
              <p className="mt-3 font-['Circe'] text-[13px] font-normal leading-relaxed text-[#FFFAF4] sm:text-[14px] md:mt-4">
                {activeBenefit.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InterestedInMicrodosing;
