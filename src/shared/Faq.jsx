import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const faqItems = [
  {
    id: "faq-1",
    question: "What's actually in these bars?",
    answer:
      "We use only organic, sustainably sourced ingredients. Our base is high-quality single-origin cacao, lightly sweetened with raw cane sugar. We never use artificial preservatives, emulsifiers, or refined sugars. Each bar is infused with pure functional mushroom extracts.",
  },
  {
    id: "faq-2",
    question: "How long does shipping take?",
    answer:
      "We ship within two business days. Most orders arrive within five to seven days depending on where you are. We pack everything carefully so it arrives in perfect condition, even in warm weather.",
  },
  {
    id: "faq-3",
    question: "Can I return or exchange?",
    answer:
      "If something isn't right, we'll make it right. Contact us within thirty days and we'll sort it out. We stand behind every bar we make.",
  },
  {
    id: "faq-4",
    question: "Are these bars vegan?",
    answer:
      "Most of our bars are vegan. Some include milk or honey. Check the product page for each bar to see what's in it. We're clear about our ingredients because you should be too.",
  },
  {
    id: "faq-5",
    question: "Do you do bulk orders?",
    answer:
      "We do. If you're thinking about ordering for an event or business, reach out directly. We can work something out that makes sense for you.",
  },
];

const BARS_PER_SCALLOP = 2;
const BAR_FRACTION = 0.5625;
const EDGE_FRACTION = 0.42;

function useFaqFrame() {
  const read = () => {
    const mobile = window.innerWidth < 768;
    return { scallops: mobile ? 5 : 9, sideBars: mobile ? 1 : 3 };
  };
  const [frame, setFrame] = useState(read);

  useEffect(() => {
    const onResize = () => setFrame(read());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return frame;
}

function Bar({ column, row, className = "" }) {
  return (
    <div
      style={{ gridColumn: column, gridRow: row, width: `${BAR_FRACTION * 100}%` }}
      className={`z-0 justify-self-end bg-[#4372B8] ${className}`}
    />
  );
}

function Faq() {
  const { scallops, sideBars } = useFaqFrame();
  const columns = scallops * BARS_PER_SCALLOP + 2;
  const phase = 1 - EDGE_FRACTION;
  const rightPhase = 1 - BAR_FRACTION + EDGE_FRACTION;
  const visibleUnits = columns - phase - (1 - rightPhase);
  const [openIds, setOpenIds] = useState({
    "faq-2": true,
    "faq-3": true,
    "faq-4": true,
    "faq-5": true,
  });

  const toggleFaq = (id) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="select-none overflow-hidden bg-[#FDFBF7]">
      <div className="h-8 bg-[#4372B8] sm:h-12 md:h-16" />
      <div
        className="grid bg-[#FDFBF7]"
        style={{
          width: `${(columns / visibleUnits) * 100}%`,
          marginLeft: `${(-phase / visibleUnits) * 100}%`,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: sideBars }).map((_, index) => (
          <Bar key={`left-${index}`} column={index + 1} row="1 / 4" />
        ))}
        {Array.from({ length: sideBars }).map((_, index) => (
          <Bar key={`right-${index}`} column={columns - sideBars + index + 1} row="1 / 4" />
        ))}

        <div style={{ gridColumn: 1, gridRow: 1 }} className="relative z-10">
          <div className="absolute top-0 right-0 h-full w-[200%] rounded-b-full bg-[#4372B8]" />
        </div>
        {Array.from({ length: scallops }).map((_, index) => (
          <div
            key={`scallop-${index}`}
            style={{ gridColumn: `${2 + index * BARS_PER_SCALLOP} / span ${BARS_PER_SCALLOP}`, gridRow: 1 }}
            className="relative z-10 aspect-[2/1] rounded-b-full bg-[#4372B8]"
          />
        ))}
        <div style={{ gridColumn: columns, gridRow: 1 }} className="relative z-10">
          <div className="absolute top-0 left-0 h-full w-[200%] rounded-b-full bg-[#4372B8]" />
        </div>

        <div
          style={{ gridColumn: `${sideBars + 1} / span ${columns - sideBars * 2}`, gridRow: 2 }}
          className="bg-[#FDFBF7] px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16"
        >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-gelica text-[32px] font-semibold leading-tight text-[#0F172A] sm:text-4xl lg:text-[48px]">
            Questions for the Curious
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-['Circe'] text-[15px] leading-relaxed text-[#1E293B] sm:mt-4 sm:text-[17px]">
            Everything you need to know about our chocolate and how we work.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl border-t border-[#E7E2D8] sm:mt-12">
          {faqItems.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div key={item.id} className="border-b border-[#E7E2D8]">
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                >
                  <span className="font-['Circe'] text-[17px] font-normal leading-snug text-[#0F172A] sm:text-[20px]">
                    {item.question}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-[#4372B8] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-5 font-['Circe'] text-[15px] leading-relaxed text-[#334155] sm:pb-6 sm:text-[16px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-xl text-center sm:mt-16">
          <h3 className="font-gelica text-[28px] font-semibold leading-tight text-[#0F172A] sm:text-[32px]">
            Still have questions?
          </h3>
          <p className="mt-3 font-['Circe'] text-[15px] leading-relaxed text-[#1E293B] sm:text-[17px]">
            Get in touch with us and we'll answer what you want to know.
          </p>
          <Link
            to="/our-mission"
            className="mt-6 inline-flex items-center justify-center bg-[#F8ECB7] px-6 py-2.5 font-['Circe'] text-[16px] font-medium text-[#4372B8] transition-colors hover:bg-[#F3E3A4]"
          >
            Contact Us
          </Link>
        </div>
        </div>

        {Array.from({ length: columns - sideBars * 2 }).map((_, index) => (
          <Bar
            key={`bottom-${index}`}
            column={sideBars + index + 1}
            row="3"
            className="h-12 self-start sm:h-16"
          />
        ))}
      </div>
    </section>
  );
}

export default Faq;
