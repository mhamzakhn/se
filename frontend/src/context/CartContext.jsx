import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/api/v1/cart')
        .then(res => setCart(res.data))
        .catch(err => console.error("Error fetching cart:", err));
    }
  }, []);

  const addItemToCart = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User must log in.");
      return;
    }
    try {
      const res = await api.post('/api/v1/cart/add', {
        item_id: item.item_id || item.id,
        name: item.name,
        price: item.price,
        discounted_price_for_LUMS_student: item.discounted_price_for_LUMS_student,
        quantity: 1
      });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error in addItemToCart:", error.response?.data?.message || error);
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("User must be logged in to update the cart");
      return;
    }
    try {
      const res = await api.put(`/api/v1/cart/item/${itemId}`, { quantity: newQuantity });
      setCart(res.data.cart);
    } catch (error) {
      console.error("Error in updateCartItem:", error.response?.data?.message || error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await api.delete('/api/v1/cart');
      setCart(res.data);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const getCartCount = () => {
    if (cart && cart.items) {
      return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    return 0;
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, updateCartItem, clearCart, getCartCount, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
