import { useNavigate } from 'react-router-dom';
import stayBg from '../../assets/stay_bg.svg';
import OrderSummary from '../checkout/OrderSummary';
import CheckoutStepper from '../checkout/CheckoutStepper';

const NEXT_STEPS = [
  {
    title: "You'll receive a confirmation email right away",
    detail: "It includes eTransfer instruction details and your order summary",
  },
  {
    title: "Send eTransfer within 24 hours — orders are held until payment is received",
    detail: "Use the email address provided in your confirmation",
  },
  {
    title: "We ship within 1–2 business days of receiving payment",
    detail: "A tracking number will be emailed once it's on its way",
  },
];

function PaymentMain() {
  const navigate = useNavigate();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigate('/invoice');
  };

  return (
    <div
      className="relative flex min-h-screen w-full select-none flex-col items-center justify-start gap-6 bg-[#4372B8] px-4 pt-24 pb-16 md:px-8 md:pt-28"
      style={{
        backgroundImage: `url(${stayBg})`,
        backgroundSize: '320px 240px',
        backgroundRepeat: 'repeat',
      }}
    >
      <CheckoutStepper active={2} />

      <div className="z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-7">
        <form onSubmit={handlePlaceOrder} className="order-2 flex w-full flex-col rounded-[4px] bg-[#FFFDF8] p-6 shadow-md md:p-10 lg:order-1 lg:p-12">
          <h1 className="mb-2 font-gelica text-[32px] font-normal text-[#4372B8] md:text-[36px]">
            Payment
          </h1>
          <p className="mb-6 font-sans text-sm text-[#4372B8]/80">
            We currently only accept Interac eTransfer payment.
          </p>

          <div className="mb-5 overflow-hidden rounded-[6px] border border-[#4372B8]/20">
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
              <label className="flex cursor-pointer items-center gap-3 font-sans text-sm font-semibold text-[#4372B8]">
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#4372B8]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4372B8]" />
                </span>
                <input type="radio" name="paymentMethod" defaultChecked className="sr-only" />
                Interac eTransfer
              </label>
              <span className="inline-flex items-center overflow-hidden rounded-[3px] bg-[#3C4043]">
                <span className="bg-[#F5B400] px-1 py-[3px] text-[8px] leading-none font-black tracking-tight text-black uppercase">
                  Interac
                </span>
                <span className="px-1.5 text-[10px] leading-none font-semibold text-white italic">
                  e-Transfer
                </span>
              </span>
            </div>
            <div className="border-t border-[#4372B8]/10 bg-[#4372B8]/[0.04] px-4 py-2.5">
              <p className="font-sans text-[12px] text-[#4372B8]/75">
                Protected by your bank. Thousands of Canadians use eTransfer safely every day.
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-[6px] border border-[#4372B8]/20 px-5 py-4">
            <h2 className="mb-1 font-sans text-sm font-semibold text-[#4372B8]">
              What happens after you place your order:
            </h2>
            <ol className="divide-y divide-[#4372B8]/10">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3 py-3.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9E6F5] font-sans text-[12px] font-semibold text-[#4372B8]">
                    {index + 1}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sans text-[13px] font-semibold text-[#4372B8]">{step.title}</span>
                    <span className="font-sans text-[12px] text-[#4372B8]/65">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <label className="mb-8 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-[#4372B8] accent-[#4372B8]"
            />
            <span className="font-sans text-xs leading-relaxed text-[#4372B8]/80">
              I'm aware of the laws regarding purchase and possession of psilocybin in my province.
            </span>
          </label>

          <button
            type="submit"
            className="w-full cursor-pointer self-start bg-[#3E6EAE] px-12 py-3.5 text-center font-['Circe'] text-[15px] font-medium text-white transition-colors hover:bg-[#355f98] lg:w-fit lg:min-w-[280px]"
          >
            Place Order
          </button>
        </form>

        <OrderSummary shippingOption={5} />
      </div>
    </div>
  );
}

export default PaymentMain;
