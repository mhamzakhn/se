// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // We'll store the entire cart object (e.g., { items: [...] })

  // On component mount, if a token is present, fetch the current user's cart
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/api/v1/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCart(data))
        .catch(err => console.error("Error fetching cart:", err));
    }
  }, []);

  // Function to add an item to the cart using the API
  const addItemToCart = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User must log in.");
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/v1/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          item_id: item.item_id || item.id,
          name: item.name,
          price: item.price,
          discounted_price_for_LUMS_student: item.discounted_price_for_LUMS_student,
          quantity: 1
        })
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart); // Update cart state with data from the backend
      } else {
        console.error("Error adding item to cart:", data.message);
      }
    } catch (error) {
      console.error("Error in addItemToCart:", error);
    }
  };

  // Calculate total number of items in cart by summing each item's quantity
  const getCartCount = () => {
    if (cart && cart.items) {
      return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    return 0;
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, getCartCount, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
