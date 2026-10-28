import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getStoredUser } from "../../lib/authSession.js";
import LoginModal from "../LoginModal";
import { useCart } from "../../context/CartContext";
import { formatPrice, getProduct } from "../../data/products";

function readUser() {
  return getStoredUser();
}

const FEATURES = ["24 PIECES\n/ BAR", "PREMIUM\nINGREDIENTS"];

export default function ProductMain() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [quantityFor, setQuantityFor] = useState(id);
  const [user, setUser] = useState(readUser);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener("auth-change", sync);
    return () => window.removeEventListener("auth-change", sync);
  }, []);

  if (quantityFor !== id) {
    setQuantityFor(id);
    setQuantity(1);
  }

  const handlePurchase = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    addToCart({
      id: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      type: product.slug,
    });
  };

  const features = [product.pieceLabel, ...FEATURES];

  return (
    <section className="px-4 pb-4 pt-2 md:px-8 md:pb-8 lg:px-10">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="aspect-[16/10] w-full bg-[#D9D9D9] lg:aspect-[7/8]" />
          <div className="mt-3 grid grid-cols-4 gap-2.5 md:mt-4 md:gap-3.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square bg-[#D9D9D9]" />
            ))}
          </div>
        </div>

        <div className="lg:pt-1">
          <p className="font-['Circe'] text-[13px] text-[#8FB0DC] md:text-[14px]">
            <Link to="/chocolates" className="hover:text-[#4372B8]">
              Shop Chocolate
            </Link>
            <span className="mx-1.5">&gt;</span>
            <span className="text-[#5C89C4]">{product.name}</span>
          </p>

          <h1 className="mt-3 max-w-[460px] font-gelica text-[32px] font-semibold leading-[1.12] text-[#141820] md:mt-4 md:text-[40px]">
            {product.name}
          </h1>

          <p className="mt-4 font-['Circe'] text-[22px] font-semibold text-[#141820] md:text-[24px]">
            {formatPrice(product.price)}
          </p>

          <div className="mt-5 flex h-11 w-[132px] items-center justify-between border border-[#E6E1D8] bg-white px-3 font-['Circe'] text-[16px] text-[#141820]">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="px-1 text-[#8A8A8A]"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="min-w-[1.5rem] text-center text-[15px]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="px-1 text-[#8A8A8A]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handlePurchase}
            className="mt-3 w-full bg-[#F9ECB7] py-3.5 font-['Circe'] text-[15px] font-medium text-[#3E6FBE] transition-colors hover:bg-[#F6E49A] md:text-[16px]"
          >
            {user ? "Add to Bag" : "Login to Purchase"}
          </button>

          <p className="mt-5 font-['Circe'] text-[13.5px] leading-[1.65] text-[#4B5563] md:text-[14.5px]">
            {product.description}
          </p>

          <div className="mt-6 border-t border-dashed border-[#E3DDD2]" />

          <div className="mt-7 grid grid-cols-3 gap-3">
            {features.map((label) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="h-[72px] w-[72px] rounded-full bg-[#D5D5D5] md:h-[78px] md:w-[78px]" />
                <p className="mt-3 whitespace-pre-line font-['Circe'] text-[10px] font-medium uppercase leading-[1.35] tracking-[0.08em] text-[#3F3F3F] md:text-[11px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setUser(readUser());
        }}
      />
    </section>
  );
}
