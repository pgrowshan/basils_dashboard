import { useCart } from "../../context/CartContext";
import blueberry from "../../assets/cake/cake-3.svg";
import hazelnut from "../../assets/cake/cake-1.svg";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "6g Hazelnut Milk Chocolate",
    category: "Macrodose",
    price: "$69.00",
    slug: "6g-hazelnut-milk",
    image: hazelnut,
    type: "hazelnut-milk",
  },
  {
    id: 2,
    name: "6g Blueberry Dark Chocolate",
    category: "Macrodose",
    price: "$69.00",
    slug: "6g-blueberry-dark",
    image: blueberry,
    type: "blueberry-dark",
  },
];

function Macrodose() {
  const { addToCart } = useCart();

  const handleQuickAdd = (product) => {
    addToCart({
      id: `macrodose-${product.id}`,
      name: `${product.name} Bar`,
      price: parseFloat(product.price.replace("$", "")),
      type: product.type,
    });
  };

  return (
    <section id="macrodose" className="scroll-mt-28 pt-12 md:pt-16">
      <h2 className="font-gelica text-[28px] font-semibold text-[#0F172A] md:text-[32px]">
        Macrodose
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

export default Macrodose;
