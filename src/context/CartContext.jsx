import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Pre-seed cart items matching the user's screenshot exactly
  const [cartItems, setCartItems] = useState([
    {
      id: 'strawberry-white-3g',
      name: '3g Strawberry White Chocolate Bar',
      price: 60.00,
      quantity: 1,
      type: 'strawberry-white'
    },
    {
      id: 'blueberry-dark-6g',
      name: '6g Blueberry Dark Chocolate Bar',
      price: 75.00,
      quantity: 1,
      type: 'blueberry-dark'
    }
  ]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSpecialOffer, setShowSpecialOffer] = useState(true);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item) => {
    const qty = item.quantity ?? 1;
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prevItems, { ...item, quantity: qty }];
    });
    // Automatically open drawer when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.quantity + amount);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const addSpecialOffer = () => {
    addToCart({
      id: 'blueberry-dark-3g-offer',
      name: '3g Blueberry Dark Chocolate Bar',
      price: 48.00,
      type: 'blueberry-dark'
    });
    setShowSpecialOffer(false);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        showSpecialOffer,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        addSpecialOffer,
        setShowSpecialOffer,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
