import { useCart } from "../../context/CartContext";
import blueberry from "../../assets/cake/cake-3.svg";
import strawberry from "../../assets/cake/cake-2.svg";
import hazelnut from "../../assets/cake/cake-1.svg";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "3g Blueberry Dark Chocolate",
    category: "Microdose",
    price: "$13.00",
    slug: "blueberry-dark",
    image: blueberry,
    type: "blueberry-dark",
  },
  {
    id: 2,
    name: "3g Strawberry White Chocolate",
    category: "Microdose",
    price: "$29.00",
    slug: "strawberry-white",
    image: strawberry,
    type: "strawberry-white",
  },
  {
    id: 3,
    name: "3g Hazelnut Milk Chocolate",
    category: "Microdose",
    price: "$39.00",
    slug: "hazelnut-milk",
    image: hazelnut,
    type: "hazelnut-milk",
  },
];

function Microdose() {
  const { addToCart } = useCart();

  const handleQuickAdd = (product) => {
    addToCart({
      id: `microdose-${product.id}`,
      name: `${product.name} Bar`,
      price: parseFloat(product.price.replace("$", "")),
      type: product.type,
    });
  };

  return (
    <section id="microdose" className="scroll-mt-28">
      <h2 className="font-gelica text-[28px] font-semibold text-[#0F172A] md:text-[32px]">
        Microdose
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickAdd={handleQuickAdd} />
        ))}
      </div>
      <div className="mt-14 border-b border-[#E7E2D6] md:mt-16" />
    </section>
  );
}

export default Microdose;
