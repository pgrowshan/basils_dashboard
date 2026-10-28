import { Link } from 'react-router-dom';
import stayBg from '../../assets/stay_bg.svg';
import OrderSummary from '../checkout/OrderSummary';
import CheckoutStepper from '../checkout/CheckoutStepper';

function InvoiceMain() {
  return (
    <div
      className="relative flex min-h-screen w-full select-none flex-col items-center justify-start gap-6 bg-[#4372B8] px-4 pt-24 pb-16 md:px-8 md:pt-28"
      style={{
        backgroundImage: `url(${stayBg})`,
        backgroundSize: '320px 240px',
        backgroundRepeat: 'repeat',
      }}
    >
      <CheckoutStepper active={3} />

      <div className="z-10 mx-auto grid w-full max-w-[1080px] grid-cols-1 items-start gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-7">
        <section className="order-2 flex w-full flex-col rounded-[4px] bg-[#FFFDF8] p-6 shadow-md md:p-10 lg:order-1 lg:p-12">
          <h1 className="mb-2 font-gelica text-[32px] font-normal text-[#4372B8] md:text-[36px]">
            Invoice
          </h1>
          <p className="mb-6 font-sans text-sm text-[#4372B8]/80">
            Your order is placed. Watch your inbox for the Interac eTransfer instructions.
          </p>

          <ol className="mb-8 divide-y divide-[#4372B8]/10 rounded-[6px] border border-[#4372B8]/20 px-5">
            <li className="flex items-start gap-3 py-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9E6F5] font-sans text-[12px] font-semibold text-[#4372B8]">1</span>
              <span className="font-sans text-[13px] text-[#4372B8]">A confirmation email is on its way with your eTransfer details and order summary.</span>
            </li>
            <li className="flex items-start gap-3 py-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9E6F5] font-sans text-[12px] font-semibold text-[#4372B8]">2</span>
              <span className="font-sans text-[13px] text-[#4372B8]">Send the eTransfer within 24 hours. We hold the order until payment arrives.</span>
            </li>
            <li className="flex items-start gap-3 py-3.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9E6F5] font-sans text-[12px] font-semibold text-[#4372B8]">3</span>
              <span className="font-sans text-[13px] text-[#4372B8]">We ship within 1–2 business days of receiving payment and email a tracking number.</span>
            </li>
          </ol>

          <Link
            to="/"
            className="w-full self-start bg-[#3E6EAE] px-12 py-3.5 text-center font-['Circe'] text-[15px] font-medium text-white transition-colors hover:bg-[#355f98] lg:w-fit"
          >
            Back to Home
          </Link>
        </section>

        <OrderSummary shippingOption={5} />
      </div>
    </div>
  );
}

export default InvoiceMain;
