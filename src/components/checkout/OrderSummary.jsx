import { useCart } from '../../context/CartContext';

export default function OrderSummary({ shippingOption = 5 }) {
  const { cartItems, subtotal } = useCart();
  
  const tax = subtotal * 0.13;
  const grandTotal = subtotal + tax + Math.max(shippingOption - 5, 0);

  return (
    <div className="order-1 flex w-full flex-col rounded-[4px] bg-[#FFFDF8] p-6 shadow-md md:p-8 lg:order-2">
      <h2 className="font-sans text-base tracking-widest text-[#2E6BBE] font-bold uppercase text-center mb-6">
        Order Summary
      </h2>

      {/* Promo Code Box */}
      <div className="mb-6 flex w-full gap-2 border-y border-dashed border-[#2E6BBE]/25 py-6">
        <input 
          type="text" 
          placeholder="Got a Promo Code?" 
          className="flex-grow bg-[#FFFDF9] border border-[#2E6BBE]/30 text-slate-800 placeholder-[#2E6BBE]/40 text-xs px-4 py-3 outline-none" 
        />
        <button 
          type="button" 
          className="border border-[#2E6BBE]/30 hover:border-[#2E6BBE]/60 text-[#2E6BBE] font-sans font-semibold text-xs px-6 py-3 transition-colors bg-white cursor-pointer"
        >
          Apply
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-dashed border-[#2E6BBE]/20">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between font-sans text-sm text-[#2E6BBE]">
              <div className="flex-grow pr-4">
                <span className="font-medium text-[#2E6BBE]/90">{item.name}</span>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <span className="text-[#2E6BBE]/60 font-semibold">x{item.quantity}</span>
                <span className="font-bold text-[#2E6BBE]/90">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))
        ) : (
          <span className="text-sm font-sans text-[#2E6BBE]/60 italic text-center py-4">Your cart is empty</span>
        )}
      </div>

      {/* Reward Points */}
      <div className="mb-4 border-b border-dashed border-[#2E6BBE]/25 pb-4">
        <span className="font-sans text-xs text-[#2E6BBE]/80">
          Earn <strong className="font-bold text-[#2E6BBE]">{Math.round(subtotal * 10)} pts</strong> with this order.
        </span>
      </div>

      {/* Pricing Totals */}
      <div className="flex flex-col gap-3 font-sans text-sm text-[#2E6BBE] mb-4">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="font-bold">${shippingOption.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-[#2E6BBE]/20">
          <span>Tax</span>
          <span className="font-bold">${tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#2E6BBE]/25 pb-4 font-sans text-base font-bold text-[#2E6BBE]">
        <span>Grand Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <div className="text-center font-script leading-none text-[#4372B8]">
        <div className="text-[34px]">Basil&apos;s</div>
        <div className="-mt-1 text-[30px]">Bakery</div>
      </div>
    </div>
  );
}
