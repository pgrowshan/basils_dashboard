import { useState } from 'react';

function ChocolateGrid({ dose }) {
  const rows = 4;
  const cols = 6;

  const isHighlighted = (row, col) => {
    if (dose === '250mg') {
      return row === 0 && col === 5;
    }
    if (dose === '500mg') {
      return row === 0 && col >= 4;
    }
    if (dose === '1 gram') {
      return col === 5;
    }
    if (dose === '1.5 gram') {
      return col === 5 || (col === 4 && row <= 1);
    }
    if (dose === '2 grams') {
      return col >= 4;
    }
    if (dose === '3 grams') {
      return col >= 3;
    }
    if (dose === '3.5 grams') {
      return col >= 3 || (col === 2 && row >= 2);
    }
    if (dose === '5 grams') {
      return col >= 1;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-6 gap-[2px] md:gap-[3px] w-full max-w-[95px] sm:max-w-[130px] aspect-[3/2] mx-auto mb-2">
      {Array.from({ length: rows }).map((_, rIndex) =>
        Array.from({ length: cols }).map((_, cIndex) => {
          const active = isHighlighted(rIndex, cIndex);
          return (
            <div
              key={`${rIndex}-${cIndex}`}
              className={`aspect-square rounded-[1px] md:rounded-[2px] transition-colors duration-300 ${
                active ? 'bg-[#82b7e6]' : 'bg-[#d1e1f0]'
              }`}
            />
          );
        })
      )}
    </div>
  );
}

function Chart() {
  const [activeTab, setActiveTab] = useState('how-much-to-take');

  const doses = [
    { name: '250mg', doseKey: '250mg' },
    { name: '500mg', doseKey: '500mg' },
    { name: '1 gram', doseKey: '1 gram' },
    { name: '1.5 grams', doseKey: '1.5 gram' },
    { name: '2 grams', doseKey: '2 grams' },
    { name: '3 grams', doseKey: '3 grams' },
    { name: '3.5 grams', doseKey: '3.5 grams' },
    { name: '5 grams', doseKey: '5 grams' },
  ];

  return (
    <section className="bg-[#fcfaf5] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Tabs Bar */}
        <div className="grid grid-cols-3 w-full bg-[#d2e2f2] rounded-t-2xl overflow-hidden select-none">
          <button
            onClick={() => setActiveTab('how-much-to-take')}
            className={`py-4 md:py-5 px-1 text-[11px] sm:text-sm md:text-lg font-gelica font-bold transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'how-much-to-take'
                ? 'bg-[#e2edf7] text-[#0F172A] border-[#3b6eba]'
                : 'bg-[#d2e2f2] text-slate-600 hover:text-slate-900 hover:bg-[#dbe9f6] border-transparent'
            }`}
          >
            How much to take?
          </button>
          <button
            onClick={() => setActiveTab('where-to-use')}
            className={`py-4 md:py-5 px-1 text-[11px] sm:text-sm md:text-lg font-gelica font-bold transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'where-to-use'
                ? 'bg-[#e2edf7] text-[#0F172A] border-[#3b6eba]'
                : 'bg-[#d2e2f2] text-slate-600 hover:text-slate-900 hover:bg-[#dbe9f6] border-transparent'
            }`}
          >
            Where to use?
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-4 md:py-5 px-1 text-[11px] sm:text-sm md:text-lg font-gelica font-bold transition-all duration-300 border-b-2 cursor-pointer ${
              activeTab === 'ingredients'
                ? 'bg-[#e2edf7] text-[#0F172A] border-[#3b6eba]'
                : 'bg-[#d2e2f2] text-slate-600 hover:text-slate-900 hover:bg-[#dbe9f6] border-transparent'
            }`}
          >
            Ingredients
          </button>
        </div>

        {/* Content Container */}
        <div className="bg-[#e2edf7] rounded-b-2xl p-5 md:p-12 shadow-sm border border-t-0 border-[#c5d5e6]">
          
          {/* Tab 1: How much to take? */}
          {activeTab === 'how-much-to-take' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              
              {/* Grid Illustration Area - FIRST ON MOBILE, SECOND ON DESKTOP */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 md:p-8 border border-slate-100 shadow-sm order-1 lg:order-2">
                <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-6 md:gap-y-10">
                  {doses.map((d) => (
                    <div key={d.name} className="flex flex-col items-center">
                      <ChocolateGrid dose={d.doseKey} />
                      <span className="font-sans text-[13px] sm:text-sm font-semibold text-[#0F172A] mt-2">
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text Area - SECOND ON MOBILE, FIRST ON DESKTOP */}
              <div className="lg:col-span-6 flex flex-col space-y-6 md:space-y-8 pr-0 lg:pr-6 order-2 lg:order-1">
                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Microdose (50mg to 250mg)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    This sub-perceptual amount is designed to work in the background without any psychoactive effects.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Microdose Plus (250mg to 500mg)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    Enhance your microdose without noticeable visual or physical effects. Ideal for individuals with higher tolerance levels.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Half dose (500mg to 1g)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    This will deliver a subtle but noticeable level of body high and giddiness. Those with lower tolerances may start to have visual experiences.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Full dose (1g to 2g)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    This should embark you on a full-on trip. With this dosage you'll have the body high and may begin to see visual anomalies (think objects swaying and fractal patterns) along with other sensory amplifications.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Deep dose (2g to 3g)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    This is entering serious dose territory. You may experience a heightened sense of "oneness" with the natural elements and people around you, and powerful visual and auditory hallucinations. You might also receive new, unfamiliar patterns of thought.
                  </p>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-[#0F172A] text-sm md:text-base mb-1.5 md:mb-2">
                    Heroic dose (3g+)
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-[#475569] leading-relaxed">
                    Anything beyond 3 grams could be considered a "heroic" dose. A dose this strong should be taken under supervision, with preparation, and in the pursuit of an intentional goal. Doses this strong are for experienced users.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Where to use? */}
          {activeTab === 'where-to-use' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#c5d5e6]/40">
                <h4 className="font-gelica text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                  <span>🧠</span> Focus & Productivity
                </h4>
                <p className="font-sans text-sm text-[#475569] leading-relaxed">
                  Best for microdosing (50mg to 250mg) in quiet study or work spaces. Enhances focus, triggers flow state, and supports cognitive clarity.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#c5d5e6]/40">
                <h4 className="font-gelica text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                  <span>🌳</span> Nature Exploration
                </h4>
                <p className="font-sans text-sm text-[#475569] leading-relaxed">
                  Best for moderate doses (500mg to 1.5g) on hikes or quiet outdoor walks. Helps ground your mind and enhances visual appreciation of nature.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#c5d5e6]/40">
                <h4 className="font-gelica text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                  <span>🎨</span> Creative Studio
                </h4>
                <p className="font-sans text-sm text-[#475569] leading-relaxed">
                  Best for mild doses (250mg to 1g) during creative sessions. Helps loosen up logic control, prompting unique connections and free expression.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#c5d5e6]/40">
                <h4 className="font-gelica text-lg font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                  <span>🧘</span> Meditation & Self-Reflection
                </h4>
                <p className="font-sans text-sm text-[#475569] leading-relaxed">
                  Best for higher doses (2g+) in a safe, quiet indoor space. Enhances mindfulness, facilitates emotional processing, and deepens reflection.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* Ingredient List */}
              <div className="lg:col-span-7 bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-[#c5d5e6]/40">
                <h4 className="font-gelica text-xl font-bold text-[#0F172A] mb-6">
                  What's inside our bars?
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-sans font-semibold text-slate-800 text-sm">70% Organic Dark Cacao</span>
                    <span className="font-sans text-slate-500 text-sm">Rich, premium Belgian blend</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-sans font-semibold text-slate-800 text-sm">Standardized Mushroom Extract</span>
                    <span className="font-sans text-slate-500 text-sm">Naturally sourced, dual-extracted</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-sans font-semibold text-slate-800 text-sm">Organic Cane Sugar & Cocoa Butter</span>
                    <span className="font-sans text-slate-500 text-sm">Clean flavor carrier, dairy-free</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="font-sans font-semibold text-slate-800 text-sm">Blueberry & Natural Oils</span>
                    <span className="font-sans text-slate-500 text-sm">Subtle antioxidant flavor notes</span>
                  </div>
                </div>
              </div>

              {/* Product Certificates */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="bg-[#fcfaf5] rounded-xl p-5 border border-slate-200 flex items-center gap-4">
                  <div className="text-3xl">🌱</div>
                  <div>
                    <h5 className="font-sans font-semibold text-slate-900 text-sm">100% Vegan & Dairy-Free</h5>
                    <p className="font-sans text-xs text-slate-500">Made cleanly without dairy or animal extracts</p>
                  </div>
                </div>

                <div className="bg-[#fcfaf5] rounded-xl p-5 border border-slate-200 flex items-center gap-4">
                  <div className="text-3xl">🌾</div>
                  <div>
                    <h5 className="font-sans font-semibold text-slate-900 text-sm">Gluten-Free Certified</h5>
                    <p className="font-sans text-xs text-slate-500">Tested and verified safe from gluten contaminants</p>
                  </div>
                </div>

                <div className="bg-[#fcfaf5] rounded-xl p-5 border border-slate-200 flex items-center gap-4">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <h5 className="font-sans font-semibold text-slate-900 text-sm">Non-GMO Ingredients</h5>
                    <p className="font-sans text-xs text-slate-500">We source only clean, natural organic inputs</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default Chart;
