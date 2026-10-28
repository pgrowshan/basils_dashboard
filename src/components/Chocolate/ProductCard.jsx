import { Link } from "react-router-dom";

function ProductCard({ product, onQuickAdd, onRestock }) {
  const soldOut = product.status === "sold-out";
  const restock = product.status === "restock";

  return (
    <article className="group flex flex-col">
      <Link to={`/chocolates/${product.slug}`} className="relative block bg-[#F2F2F2]">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[375/417] w-full object-cover"
        />

        {soldOut && (
          <span className="absolute left-3 top-3 bg-[#0F172A] px-2.5 py-1.5 font-['Circe'] text-[11px] font-semibold leading-none text-[#F8ECB7] md:left-4 md:top-4 md:text-[12px]">
            Too Yummy - Sold Out!
          </span>
        )}

        {restock && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRestock?.(product);
            }}
            className="absolute inset-x-0 bottom-0 bg-[#0F172A] py-3 font-['Circe'] text-[13px] font-semibold text-[#F8ECB7] md:text-[15px]"
          >
            Get Restock Update
          </button>
        )}

        {!soldOut && !restock && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onQuickAdd?.(product);
            }}
            className="absolute inset-x-0 bottom-0 bg-[#4372B8] py-3 font-['Circe'] text-[13px] font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:text-[15px]"
          >
            Quick Add
          </button>
        )}
      </Link>

      <div className="mt-4">
        <Link to={`/chocolates/${product.slug}`}>
          <h3 className="font-gelica text-[15px] font-semibold leading-snug text-[#0F172A] md:text-[18px]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 font-['Circe'] text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">
          {product.category}
        </p>
        <p className="mt-1.5 font-['Circe'] text-[15px] font-semibold text-[#0F172A]">
          {product.price}
        </p>
      </div>
    </article>
  );
}

export default ProductCard;
