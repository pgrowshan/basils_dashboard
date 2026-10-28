import { useState } from "react";
import { useParams } from "react-router-dom";
import { DOSE_COPY, getProduct } from "../../data/products";

const TABS = [
  { id: "how-much-to-take", label: "How much to take?" },
  { id: "where-to-use", label: "Where to use?" },
  { id: "ingredients", label: "Ingredients" },
];

function ChocolateGrid({ pieces }) {
  const columns = 6;
  const rows = 4;

  const isOn = (row, col) => {
    if (pieces <= 2) return row === 0 && col >= columns - pieces;
    const fromRight = columns - 1 - col;
    const fullColumns = Math.floor(pieces / rows);
    const remainder = pieces % rows;
    if (fromRight < fullColumns) return true;
    return fromRight === fullColumns && row < remainder;
  };

  return (
    <div className="grid w-full grid-cols-6 gap-[3px]">
      {Array.from({ length: rows * columns }).map((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        return (
          <div
            key={index}
            className={`aspect-square ${isOn(row, col) ? "bg-[#7EB4E6]" : "bg-[#D3E3F3]"}`}
          />
        );
      })}
    </div>
  );
}

export default function ProductTabs() {
  const { id } = useParams();
  const product = getProduct(id);
  const [activeTab, setActiveTab] = useState("how-much-to-take");

  return (
    <section className="px-4 py-8 md:px-8 md:py-12 lg:px-10">
      <div className="mx-auto max-w-[1080px] overflow-hidden rounded-[16px] bg-[#D5E3F0]">
        <div className="grid grid-cols-3">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-4 font-gelica text-[13px] text-[#1A1A1A] sm:text-[16px] md:py-5 md:text-[18px] ${
                  active ? "bg-[#D5E3F0]" : "bg-[#F6F3EC]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
          {activeTab === "how-much-to-take" && (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="order-2 space-y-5 lg:order-1 lg:pr-4">
                {DOSE_COPY.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-['Circe'] text-[14px] font-semibold text-[#1A1A1A] md:text-[15px]">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-['Circe'] text-[13px] leading-relaxed text-[#4B5563] md:text-[14px]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="order-1 bg-[#FFFDF8] px-4 py-6 md:px-8 md:py-8 lg:order-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-10 md:gap-y-9">
                  {product.doses.map((dose) => (
                    <div key={dose.label} className="flex flex-col items-center">
                      <ChocolateGrid pieces={dose.pieces} />
                      <span className="mt-2.5 font-['Circe'] text-[13px] text-[#1A1A1A] md:text-[14px]">
                        {dose.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "where-to-use" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {[
                ["Focus and productivity", "Microdoses belong in a quiet room where you can work or study. The amount stays in the background and supports a clear, steady focus."],
                ["Nature", "A half dose is easier outdoors, on a walk or somewhere green, where a lighter body feel has room to settle."],
                ["Creative work", "A mild dose loosens a stuck session. Keep the tools you need close and the rest of the room simple."],
                ["Reflection", "Deeper doses belong in a familiar, private space, with time set aside and someone you trust nearby if you go further."],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-['Circe'] text-[15px] font-semibold text-[#1A1A1A]">{title}</h3>
                  <p className="mt-1.5 font-['Circe'] text-[14px] leading-relaxed text-[#4B5563]">{body}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="max-w-[640px] space-y-4">
              <h3 className="font-['Circe'] text-[15px] font-semibold text-[#1A1A1A]">What's in the bar</h3>
              {[
                ["Cacao and cocoa butter", "The chocolate base."],
                ["Cane sugar", "Just enough to carry the flavour."],
                ["Dried mushrooms", `${product.grams}g across 24 pieces.`],
                ["Flavour", "Fruit or nut, depending on the bar."],
              ].map(([title, body]) => (
                <div key={title} className="border-b border-[#C5D5E6] pb-3">
                  <p className="font-['Circe'] text-[14px] font-semibold text-[#1A1A1A]">{title}</p>
                  <p className="mt-0.5 font-['Circe'] text-[13px] text-[#4B5563]">{body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
