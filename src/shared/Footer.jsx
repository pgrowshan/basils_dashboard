import { Link } from "react-router-dom";
import logo from "../assets/Logo.svg";
import mobileFooterLogo from "../assets/nav/mobile-footer-logo.svg";

const menuLinks = [
  { label: "Chocolates", to: "/chocolates" },
  { label: "Gift Sets", to: "/chocolates" },
  { label: "Bulk Orders", to: "/chocolates" },
  { label: "Corporate Orders", to: "/chocolates" },
];

const learnLinks = [
  { label: "How to Get Started", to: "/start-here" },
  { label: "Our Story", to: "/our-mission" },
  { label: "Shipping & Orders", to: "/start-here" },
  { label: "Contact Us", to: "/our-mission" },
  { label: "Affiliates", to: "/our-mission" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/our-mission" },
  { label: "Terms of Service", to: "/our-mission" },
  { label: "Cookies Settings", to: "/our-mission" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.2C12.2 3 11 4.4 11 6.6v1.9H9v2.6h2V21h3.5v-9.9h2.3l.4-2.6h-2.7z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.3 3H3.2l7 9.7L3.2 21h1.6l6.2-6.8L14.7 21h6.1l-7.3-10.1Zm-2.2 2.4-.7-1L5.4 4.2h2.4l4.6 6.3.7 1 6 8.2h-2.4l-4.8-6.6Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M6.7 9.3H4V20h2.7V9.3ZM5.3 4C4.4 4 3.7 4.7 3.7 5.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6S6.2 4 5.3 4ZM20 20h-2.7v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H11V9.3h2.6v1.5h.1c.4-.7 1.3-1.5 2.6-1.5 2.8 0 3.3 1.8 3.3 4.2V20Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  },
];

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="font-['Circe'] text-[15px] leading-none text-[#F8EFB8] transition-opacity hover:opacity-70 sm:text-[16px]"
      >
        {children}
      </Link>
    </li>
  );
}

function Footer() {
  return (
    <footer className="select-none bg-[#0F172A] text-[#F8EFB8]">
      <div className="mx-auto max-w-[1120px] px-6 py-14 sm:px-10 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 text-center lg:grid-cols-4 lg:gap-10 lg:text-left">
          <div className="order-4 flex flex-col items-center lg:order-none lg:items-start">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src={mobileFooterLogo} alt="Basil's Bakery" className="h-[132px] w-auto lg:hidden" />
              <img src={logo} alt="" className="hidden h-[92px] w-auto lg:block" />
            </Link>
            <p className="mt-4 w-[168px] text-center font-serif text-[15px] italic leading-snug text-[#F8EFB8]">
              Sweets made with love
              <br />
              are meant to be shared.
            </p>
          </div>

          <div className="order-2 lg:order-none">
            <h3 className="font-gelica text-[20px] font-semibold text-[#F8EFB8]">Menu</h3>
            <ul className="mt-5 flex flex-col items-center gap-3.5 lg:items-start">
              {menuLinks.map((item) => (
                <FooterLink key={item.label} to={item.to}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div className="order-3 lg:order-none">
            <h3 className="font-gelica text-[20px] font-semibold text-[#F8EFB8]">Learn</h3>
            <ul className="mt-5 flex flex-col items-center gap-3.5 lg:items-start">
              {learnLinks.map((item) => (
                <FooterLink key={item.label} to={item.to}>
                  {item.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div className="order-1 flex flex-col items-center lg:order-none lg:items-start">
            <h3 className="font-gelica text-[20px] font-semibold text-[#F8EFB8]">Connect with us!</h3>
            <div className="mt-4 flex items-center gap-3.5">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="text-[#F8EFB8] transition-opacity hover:opacity-70"
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <a
              href="mailto:hello@basilsbakery.com"
              className="mt-4 font-serif text-[16px] italic text-[#F8EFB8] underline decoration-[#F8EFB8] underline-offset-2"
            >
              hello@basilsbakery.com
            </a>
            <p className="mt-3 max-w-[250px] font-serif text-[15px] italic leading-relaxed text-[#F8EFB8]">
              Please feel free to{" "}
              <Link to="/our-mission" className="underline decoration-[#F8EFB8] underline-offset-2">
                contact us
              </Link>{" "}
              with questions our wonderful support team is happy to chat with you.
            </p>
          </div>
        </div>

        <div className="mt-14 h-px bg-[#F8EFB8]/25 lg:mt-16" />

        <div className="mt-5 flex flex-col items-center gap-4 font-['Circe'] text-[14px] text-[#F8EFB8] sm:flex-row sm:justify-between sm:text-[15px]">
          <p>&copy; 2025 Basil&apos;s Bakery</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="underline decoration-[#F8EFB8] underline-offset-2 transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
