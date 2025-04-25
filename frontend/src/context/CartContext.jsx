import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

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
        setCart(data.cart);
      } else {
        console.error("Error adding item to cart:", data.message);
      }
    } catch (error) {
      console.error("Error in addItemToCart:", error);
    }
  };

  const updateCartItem = async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("User must be logged in to update the cart");
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/v1/cart/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        console.error("Error updating cart:", data.message);
      }
    } catch (error) {
      console.error("Error in updateCartItem:", error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const response = await fetch('http://localhost:4000/api/v1/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data);
      } else {
        console.error("Failed to clear cart:", data.message);
      }
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
