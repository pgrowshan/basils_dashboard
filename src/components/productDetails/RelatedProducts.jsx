import { Link, useParams } from "react-router-dom";
import { formatPrice, getRelated } from "../../data/products";

export default function RelatedProducts() {
  const { id } = useParams();
  const products = getRelated(id);

  return (
    <section className="px-4 pb-16 pt-6 md:px-8 md:pb-20 lg:px-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="border-t border-dashed border-[#E3DDD2]" />
        <h2 className="mt-10 text-center font-gelica text-[26px] font-semibold text-[#141820] md:mt-12 md:text-[32px]">
          Other Sweet Treats to Enjoy
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-10 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <Link key={product.slug} to={`/chocolates/${product.slug}`} className="block">
              <div className="aspect-[4/5] w-full bg-[#D9D9D9]" />
              <h3 className="mt-4 font-gelica text-[16px] font-semibold leading-snug text-[#141820] md:text-[18px]">
                {product.name.replace(" Bar", "")}
              </h3>
              <p className="mt-1.5 font-['Circe'] text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8F98]">
                {product.category}
              </p>
              <p className="mt-1.5 font-['Circe'] text-[15px] font-semibold text-[#141820]">
                {formatPrice(product.price)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
