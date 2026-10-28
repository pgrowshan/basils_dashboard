import Marquee from "../shared/Marquee.jsx";
import Starter from "../components/home/Starter.jsx";
import Journey from "../components/home/Journey.jsx";
import Interested from "../components/home/Interested.jsx";
import InterestedInMicrodosing from "../shared/InterestedInMicrodosing.jsx";
import WhatMakes from "../components/home/WhatMakes.jsx";
import Need from "../components/home/Need.jsx";
import Faq from "../shared/Faq.jsx";
import Stay from "../shared/Stay.jsx";
import Hero from "../components/home/Hero.jsx";

function Homepage() {
  return (
    <>
      <Hero />

      {/* Brand Scrolling Marquee Bar */}
      <Marquee />

      {/* Chocolate Starter Cards Section */}
      <Starter />

      {/* Journey Guide Section */}
      <Journey />

      {/* Microdose bar carousel */}
      <Interested />

      {/* Microdosing Slider Section */}
      <InterestedInMicrodosing />

      {/* Need More Umph Section */}
      <Need />

      {/* What Makes Us Good Section */}
      <WhatMakes />

      {/* Frequently Asked Questions */}
      <Faq />

      {/* Stay in the Loop Newsletter Section */}
      <Stay />
    </>
  );
}

export default Homepage;
