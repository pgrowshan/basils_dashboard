import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Stay from '../../shared/Stay';
import { formatPaid, getOrder } from '../../data/orders';

function reorderLines(lines, addToCart) {
  lines.forEach((line) => {
    addToCart({
      id: line.cartId,
      name: line.name,
      price: line.price,
      quantity: line.qty,
      type: line.slug,
    });
  });
}

export default function OrderDetailMain() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="bg-[#FFFAF4] px-4 pt-32 pb-20 text-center">
        <h1 className="font-gelica text-3xl text-[#1A2744]">Order not found</h1>
        <Link to="/account" className="mt-6 inline-block font-sans text-sm text-[#4372B8]">Back to My Account</Link>
      </div>
    );
  }

  const total = order.subtotal + order.shipping + order.tax;
  const itemCount = order.lines.length;

  return (
    <div className="bg-[#FFFAF4] pt-24 text-[#1A2744]">
      <div className="mx-auto w-full max-w-[980px] px-4 pt-6 pb-16 md:px-8 md:pt-8">
        <p className="mb-4 font-sans text-xs text-[#7A8BA3]">
          <Link to="/account" className="hover:text-[#4372B8]">My Account</Link>
          <span className="mx-1.5">&gt;</span>
          <span>Order #{order.id}</span>
        </p>

        <section className="flex flex-col gap-4 rounded-[8px] bg-[#F8EDB7] p-5 md:flex-row md:items-center md:justify-between md:p-7">
          <div>
            <h1 className="font-gelica text-[32px] leading-none font-normal text-[#4372B8] md:text-[40px]">Order #{order.id}</h1>
            <p className="mt-2 font-sans text-[13px] text-[#5C6B82]">
              Placed {order.placed} · {itemCount} items{order.delivered ? ` · Delivered ${order.delivered}` : ''}
            </p>
            <div className="mt-4 rounded-[6px] bg-[#FFFDF8] px-4 py-3 md:hidden">
              <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#7A8BA3]">STATUS</p>
              <p className="mt-0.5 font-sans text-lg font-semibold text-[#1A2744]">{order.status}</p>
              <p className="font-sans text-xs text-[#7A8BA3]">{order.note}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => reorderLines(order.lines, addToCart)}
                className="cursor-pointer border border-[#C9D0DC] bg-[#FFFDF8] px-4 py-2 font-sans text-sm text-[#4372B8]"
              >
                Reorder
              </button>
              <button type="button" className="cursor-pointer border border-[#C9D0DC] bg-[#FFFDF8] px-4 py-2 font-sans text-sm text-[#4372B8]">
                Get Invoice
              </button>
            </div>
          </div>
          <div className="hidden min-w-[190px] rounded-[6px] bg-[#FFFDF8] px-5 py-3 text-right md:block">
            <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#7A8BA3]">STATUS</p>
            <p className="mt-1 font-sans text-lg font-semibold text-[#1A2744]">{order.status}</p>
            <p className="font-sans text-xs text-[#7A8BA3]">{order.note}</p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-center font-gelica text-[32px] font-normal md:text-[38px]">Items in This Order</h2>
          <div className="mt-8 hidden items-center gap-4 px-4 font-sans text-[11px] font-semibold tracking-[0.12em] text-[#8A97A8] md:flex">
            <span className="w-12 shrink-0" />
            <span className="flex-1">PRODUCT</span>
            <span className="w-[92px] shrink-0 whitespace-nowrap">QUANTITY</span>
            <span className="w-[120px] shrink-0 whitespace-nowrap">AMOUNT PAID</span>
            <span className="w-[132px] shrink-0 whitespace-nowrap">DATE DELIVERED</span>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {order.lines.map((line) => (
              <article key={line.name} className="rounded-[8px] border border-[#E4E0D6] bg-white px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#E7E7E7] text-[#8A8A8A]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.4">
                      <rect x="4" y="5" width="16" height="14" rx="1.5" />
                      <path d="M8 5.5V4.5h8v1" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold">{line.name}</p>
                    <p className="font-sans text-[11px] tracking-[0.12em] text-[#8A97A8]">{line.kind}</p>
                  </div>
                  <p className="hidden w-[92px] shrink-0 font-sans text-sm md:block">{line.qty}</p>
                  <p className="hidden w-[120px] shrink-0 font-sans text-sm md:block">{formatPaid(line.paid)}</p>
                  <p className="hidden w-[132px] shrink-0 font-sans text-sm md:block">{line.delivered}</p>
                </div>
                <div className="mt-3 flex justify-between font-sans text-xs text-[#5C6B82] md:hidden">
                  <span>Qty {line.qty}</span>
                  <span>{formatPaid(line.paid)}</span>
                  <span>{line.delivered}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-center font-gelica text-[32px] font-normal md:text-[38px]">Delivery & Payment</h2>
          <p className="mt-2 text-center font-sans text-sm text-[#5C6B82]">Where this order went and how it was paid for.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-[8px] bg-[#F8EDB7] p-5">
              <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#4372B8]">DELIVERY</p>
              <h3 className="mt-1 font-sans text-base font-semibold text-[#4372B8]">Shipping Address</h3>
              {order.address.map((line) => (
                <p key={line} className="font-sans text-sm text-[#3E4C63]">{line}</p>
              ))}
              <Link to="/our-mission" className="mt-4 inline-block border border-[#4372B8]/40 bg-[#FFFDF8] px-3 py-1.5 font-sans text-xs text-[#4372B8]">
                Wrong Address? Contact Us
              </Link>
            </article>
            <article className="rounded-[8px] bg-[#F8EDB7] p-5">
              <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#4372B8]">BILLING</p>
              <h3 className="mt-1 font-sans text-base font-semibold text-[#4372B8]">Payment Method</h3>
              <p className="mt-2 font-sans text-sm text-[#3E4C63]">{order.payment}</p>
            </article>
            <article className="rounded-[8px] bg-[#F8EDB7] p-5">
              <p className="font-sans text-[10px] font-semibold tracking-[0.16em] text-[#4372B8]">AMOUNT PAID</p>
              <div className="mt-2 space-y-1 font-sans text-sm text-[#3E4C63]">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPaid(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{formatPaid(order.shipping)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{formatPaid(order.tax)}</span></div>
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-[#E4D7A4] pt-3">
                <span className="font-sans text-sm font-semibold">Total Paid</span>
                <span className="font-gelica text-[28px] leading-none">{formatPaid(total)}</span>
              </div>
            </article>
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/account" className="border border-[#4372B8] px-5 py-2.5 font-sans text-sm text-[#4372B8]">
            Back to My Account
          </Link>
          <button
            type="button"
            onClick={() => reorderLines(order.lines, addToCart)}
            className="cursor-pointer bg-[#F6E7A8] px-5 py-2.5 font-sans text-sm text-[#1A2744]"
          >
            Reorder These Items
          </button>
        </div>
      </div>
      <Stay />
    </div>
  );
}
