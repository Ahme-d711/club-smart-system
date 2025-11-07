import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('clubCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('clubCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, venueId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && cartItem.venueId === venueId
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.venueId === venueId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, venueId, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (itemId, venueId) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.id === itemId && item.venueId === venueId)
      )
    );
  };

  const updateQuantity = (itemId, venueId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, venueId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && item.venueId === venueId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

