import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    showSpecialOffer,
    closeCart,
    removeFromCart,
    updateQuantity,
    addSpecialOffer,
    setShowSpecialOffer,
    subtotal,
    totalItems
  } = useCart();

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  // High-fidelity CSS gradient renderers for item thumbnails
  const renderItemThumbnail = (type) => {
    if (type === 'strawberry-white') {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-[#fbcfe8] via-[#fae3d9] to-[#ffe4e6] relative flex items-center justify-center p-1 rounded-sm border border-slate-100 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.7)] select-none">
          <span className="text-[10px] text-pink-600/35 font-serif font-black tracking-tighter">SW</span>
        </div>
      );
    }
    // Blueberry dark
    return (
      <div className="w-full h-full bg-gradient-to-tr from-[#1e1b4b] via-[#312e81] to-[#3b0764] relative flex items-center justify-center p-1 rounded-sm border border-slate-700/10 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1)] select-none">
        <span className="text-[10px] text-slate-300/30 font-serif font-black tracking-tighter">BD</span>
      </div>
    );
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden select-none">
      {/* Dimmed backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer main panel */}
      <div className="absolute right-0 top-0 h-screen w-full max-w-[400px] bg-[#fffdfa] shadow-2xl flex flex-col z-50 animate-slide-in">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-200/80">
          <h2 className="font-gelica text-[#0F172A] text-xl font-bold tracking-tight">
            Items in your Bag
          </h2>
          <button
            onClick={closeCart}
            className="text-slate-400 hover:text-slate-800 transition-colors p-1.5 cursor-pointer text-xl"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto py-4 px-6 space-y-6 flex flex-col justify-start">
          
          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
              <span className="text-4xl mb-4">🛒</span>
              <p className="font-sans text-sm text-slate-500 font-semibold uppercase tracking-wider">Your bag is empty</p>
              <button 
                onClick={closeCart}
                className="text-[#3b6eba] font-sans font-bold text-xs uppercase tracking-widest mt-4 hover:underline cursor-pointer"
              >
                Go Shop Chocolates
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-start border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  {/* Thumbnail Image Box */}
                  <div className="w-[72px] h-[72px] bg-slate-200 shrink-0 overflow-hidden shadow-xs border border-slate-200/60">
                    {renderItemThumbnail(item.type)}
                  </div>

                  {/* Details column */}
                  <div className="flex-grow flex flex-col">
                    <h3 className="font-sans font-semibold text-slate-800 text-sm leading-snug">
                      {item.name}
                    </h3>
                    <span className="font-sans text-slate-500 font-bold text-xs mt-1">
                      ${item.price.toFixed(2)}
                    </span>
                    
                    {/* Quantity Adjustment Row */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-200 rounded bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="px-2 text-slate-700 font-sans text-xs font-semibold text-center min-w-[20px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          &#43;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors px-1 cursor-pointer text-sm"
                    aria-label="Remove item"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Special Offer Card */}
          {showSpecialOffer && (
            <div className="bg-[#fef9e3] border border-[#3b6eba]/25 rounded-xl p-4 relative shadow-sm shrink-0">
              {/* Close special offer button */}
              <button
                onClick={() => setShowSpecialOffer(false)}
                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer text-sm"
                aria-label="Dismiss special offer"
              >
                &times;
              </button>

              <h4 className="font-gelica text-[#3b6eba] text-[15px] font-bold tracking-tight mb-3">
                Special Offer
              </h4>

              <div className="flex gap-3.5 items-start">
                {/* Visual Thumbnail */}
                <div className="w-[64px] h-[64px] bg-slate-200 shrink-0 overflow-hidden shadow-xs border border-slate-200/50">
                  {renderItemThumbnail('blueberry-dark')}
                </div>

                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-slate-800 text-xs leading-snug">
                    3g Blueberry Dark Chocolate Bar
                  </span>
                  
                  {/* Price Comparison */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-sans text-[#3b6eba] font-bold text-xs">$48.00</span>
                    <span className="font-sans text-slate-400 line-through text-[11px]">$60.00</span>
                    <span className="font-sans text-emerald-600 text-[10px] font-semibold tracking-wide">(save 20%)</span>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    onClick={addSpecialOffer}
                    className="bg-[#3b6eba] hover:bg-[#2f5a9e] text-white font-sans font-bold text-[10px] uppercase tracking-wider py-2 px-4 shadow-sm transition-colors w-fit mt-3 cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom subtotal and action checkout panel */}
        <div className="border-t border-slate-200/80 p-6 bg-white flex flex-col">
          <div className="flex justify-between items-center text-slate-500 text-sm font-sans mb-2 font-medium">
            <span>Summary</span>
            <span>{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
          </div>

          <div className="flex justify-between items-center text-slate-800 text-base font-sans font-bold mb-4">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              closeCart();
              navigate('/checkout');
            }}
            className="w-full bg-[#3b6eba] hover:bg-[#2f5a9e] text-white font-sans font-bold text-xs uppercase tracking-[0.2em] py-4 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer text-center"
          >
            Checkout
          </button>
        </div>

      </div>
    </div>
  );
}
