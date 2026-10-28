import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
// Default mock data, designed to be overriden via router state or API
const defaultProduct = {
  id: 'strawberry-white',
  title: '3g Strawberry White Chocolate Bar',
  price: '$65.00',
  description: "One bite and there's no turning back. Experience 5 grams of perspective-shifting psilocybin covered in sweet chocolate. This bar isn't just delicious, it makes you question time, space, and why you've been ignoring that one part of yourself that still believes in magic. It's smooth. It's intense. It's the trip you take when you're done playing it safe.",
  images: [
    '', // Main image
    '', // Thumb 1
    '', // Thumb 2
    '', // Thumb 3
    ''  // Thumb 4
  ],
  features: [
    { id: 1, text: "125MG\n/ PIECE" },
    { id: 2, text: "24 PIECES\n/ BAR" },
    { id: 3, text: "PREMIUM\nINGREDIENTS" }
  ]
};
const Details = () => {
  const location = useLocation();
  // Attempt to get product data from router state (e.g., navigated from Shop page)
  const product = location.state?.product || defaultProduct;
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));
  return (
    <div className="bg-[#fdfcfa] min-h-screen py-10 md:py-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Display Image */}
          <div className="w-full aspect-square bg-[#d9d9d9] rounded-xl overflow-hidden shadow-sm">
             {product.images[activeImageIndex] ? (
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                />
             ) : (
                <div className="w-full h-full bg-[#d9d9d9]"></div>
             )}
          </div>
          
          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.slice(1, 5).map((img, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImageIndex(index + 1)}
                className={`w-full aspect-square bg-[#d9d9d9] rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === index + 1 ? 'border-[#446597]' : 'border-transparent'
                }`}
                aria-label={`View image ${index + 2}`}
              >
                 {img && <img src={img} alt={`${product.title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />}
              </button>
            ))}
          </div>
        </div>
        {/* Right Column: Product Details */}
        <div className="flex flex-col pt-2 md:pt-4">
          
          {/* Breadcrumb */}
          <div className="text-[13px] md:text-sm font-sans mb-8">
            <Link to="/shop" className="text-[#a5c3ed] hover:text-[#446597] transition-colors">
              Shop Chocolates
            </Link>
            <span className="text-[#a5c3ed] mx-2">&gt;</span>
            <span className="text-[#446597]">{product.title}</span>
          </div>
          {/* Title */}
          <h1 className="text-4xl md:text-[40px] lg:text-[44px] font-gelica font-bold text-[#142340] mb-5 leading-[1.1] tracking-tight pr-4">
            {product.title}
          </h1>
          
          {/* Price */}
          <p className="text-xl md:text-[22px] font-bold text-[#142340] mb-8">
            {product.price}
          </p>
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#a5c3ed] rounded bg-white w-fit mb-8">
            <button 
              onClick={decreaseQuantity}
              className="px-4 py-2.5 text-[#555] hover:text-[#142340] transition-colors"
              aria-label="Decrease quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <span className="px-6 py-2 text-[#142340] font-sans text-sm font-medium border-x border-[#a5c3ed]">
              {quantity}
            </span>
            <button 
              onClick={increaseQuantity}
              className="px-4 py-2.5 text-[#555] hover:text-[#142340] transition-colors"
              aria-label="Increase quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          {/* Action Button */}
          {/* Note: the text matches "Login to Purchase" from the image. If the user is logged in, this would map to "Add to Cart". */}
          <button className="w-full bg-[#f9ebb4] hover:bg-[#f3e198] text-[#446597] font-sans font-bold text-[15px] py-4 px-8 mb-8 transition-colors shadow-sm cursor-pointer">
            Login to Purchase
          </button>
          {/* Description */}
          <p className="text-[#3b414f] text-sm md:text-[15px] leading-[1.8] mb-8">
            {product.description}
          </p>
          {/* Separator */}
          <hr className="border-t border-dashed border-[#a5c3ed] mb-8" />
          {/* Features Icons */}
          <div className="flex justify-between md:justify-start md:gap-14 lg:gap-16">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] bg-[#d9d9d9] rounded-full mb-4"></div>
                <p className="text-[10px] md:text-[11px] font-bold text-[#555] uppercase tracking-wider whitespace-pre-line leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Details;