import { useState } from "react";
import { useCart } from "../../context/CartContext";
import blueberry from "../../assets/cake/cake-3.svg";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Berry Happy Microdose Set",
    category: "Bundle",
    price: "$120",
    status: "sold-out",
    slug: "berry-happy-set",
    image: blueberry,
  },
  {
    id: 2,
    name: "Sweet Tooth Microdose Set",
    category: "Bundle",
    price: "$120",
    status: "restock",
    slug: "sweet-tooth-set",
    image: blueberry,
  },
  {
    id: 3,
    name: "Blueberry - Ease into it Set",
    category: "Bundle",
    price: "$120",
    status: "available",
    slug: "blueberry-ease-set",
    image: blueberry,
  },
  {
    id: 4,
    name: "All Three Please - Microdose Set",
    category: "Bundle",
    price: "$180",
    status: "available",
    slug: "all-three-set",
    image: blueberry,
  },
  {
    id: 5,
    name: "Big Two - Macrodose Set",
    category: "Bundle",
    price: "$150",
    status: "available",
    slug: "big-two-set",
    image: blueberry,
  },
  {
    id: 6,
    name: "I'll Take Everything",
    category: "Bundle",
    price: "$400",
    status: "available",
    slug: "everything-set",
    image: blueberry,
  },
];

function Bundles() {
  const { addToCart } = useCart();
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(false);

  const handleQuickAdd = (product) => {
    addToCart({
      id: `bundle-${product.id}`,
      name: product.name,
      price: parseFloat(product.price.replace("$", "")),
      type: "blueberry-dark",
    });
  };

  const openRestockModal = (product) => {
    setSelectedProduct(product);
    setEmailInput("");
    setSubmittedEmail(false);
    setShowRestockModal(true);
  };

  const handleRestockSubmit = (event) => {
    event.preventDefault();
    if (!emailInput) return;
    setSubmittedEmail(true);
    setTimeout(() => setShowRestockModal(false), 1500);
  };

  return (
    <section id="bundles" className="scroll-mt-28 pt-12 md:pt-16">
      <h2 className="font-gelica text-[28px] font-semibold text-[#0F172A] md:text-[32px]">
        Bundles Galore
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAdd={handleQuickAdd}
            onRestock={openRestockModal}
          />
        ))}
      </div>

      {showRestockModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md bg-[#FFF9F3] p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowRestockModal(false)}
              className="absolute top-4 right-4 text-2xl leading-none text-[#64748B]"
              aria-label="Close"
            >
              &times;
            </button>

            {!submittedEmail ? (
              <form onSubmit={handleRestockSubmit} className="flex flex-col">
                <h3 className="font-gelica text-2xl font-semibold text-[#0F172A]">Restock Alert</h3>
                <p className="mt-3 font-['Circe'] text-sm text-[#64748B]">
                  We&apos;ll let you know the moment the <strong>{selectedProduct?.name}</strong> is back in stock.
                </p>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  className="mt-6 w-full border border-[#E7E2D6] bg-white px-4 py-3 font-['Circe'] text-sm focus:border-[#4372B8] focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-4 w-full bg-[#0F172A] py-3 font-['Circe'] text-sm font-semibold tracking-wide text-[#F8ECB7]"
                >
                  Notify Me
                </button>
              </form>
            ) : (
              <div className="py-6 text-center">
                <h3 className="font-gelica text-2xl font-semibold text-[#0F172A]">Subscription Added!</h3>
                <p className="mt-2 font-['Circe'] text-sm text-[#64748B]">
                  We&apos;ll notify you at <strong>{emailInput}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Bundles;
