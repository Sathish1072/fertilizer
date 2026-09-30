import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const targetId = String(product._id || product.id);
    const normalizedProduct = {
      ...product,
      id: targetId,
      _id: targetId,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => String(item.id || item._id) === targetId
      );
      if (existingItem) {
        return prevItems.map((item) =>
          String(item.id || item._id) === targetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...normalizedProduct, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    const targetId = String(productId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.id || item._id) !== targetId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const targetId = String(productId);
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id || item._id) === targetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + Number(item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
