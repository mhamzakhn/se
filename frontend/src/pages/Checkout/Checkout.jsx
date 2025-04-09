// src/pages/Checkout.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, updateCartItem } = useCart();
  const cartItems = (cart && cart.items) || [];

  // Retrieve authentication and student status from localStorage
  const token = localStorage.getItem('token');
  const studentStatus = localStorage.getItem('studentStatus') || 'non-student';

  const getItemPrice = (item) => {
    return token && studentStatus === 'student'
      ? item.discounted_price_for_LUMS_student
      : item.price;
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + getItemPrice(item) * item.quantity,
      0
    );
  };

  const handleIncrease = (itemId, currentQuantity) => {
    updateCartItem(itemId, currentQuantity + 1);
  };

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateCartItem(itemId, currentQuantity - 1);
    } else {
      console.log("Minimum quantity reached.");
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("User must be logged in to place an order.");
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/v1/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error placing order:", data.message);
      } else {
        console.log("Order placed successfully:", data.order);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2>Checkout</h2>
        {token && studentStatus === 'student' && (
          <p style={{ color: "green", fontSize: "0.9rem" }}>
            Discounted prices applied
          </p>
        )}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div className="checkout-item" key={item.item_id}>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      Unit Price: PKR {getItemPrice(item)}<br />
                      Subtotal: PKR {getItemPrice(item) * item.quantity}
                    </p>
                  </div>
                  <div className="item-controls">
                    <button onClick={() => handleDecrease(item.item_id, item.quantity)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.item_id, item.quantity)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h3>Total Amount: PKR {getCartTotal()}</h3>
            <button className="checkout-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;