const STEPS = ["Checkout", "Payment", "Invoice"];

export default function CheckoutStepper({ active = 1 }) {
  return (
    <div className="relative mx-auto mb-8 flex w-full max-w-[440px] items-start md:mb-10">
      <div className="absolute top-[13px] right-[16.67%] left-[16.67%] h-px bg-white" />
      {STEPS.map((label, index) => {
        const number = index + 1;
        const current = number === active;
        return (
          <div key={label} className="relative z-10 flex flex-1 flex-col items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full font-['Circe'] text-[13px] font-semibold ${
                current ? "bg-[#F6E7A8] text-[#2C3A4A]" : "bg-white text-[#4372B8]"
              }`}
            >
              {number}
            </div>
            <span className="mt-2 font-['Circe'] text-[11px] font-medium tracking-[0.16em] text-white">
              {label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
