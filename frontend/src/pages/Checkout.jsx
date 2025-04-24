// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Minus, Plus, Trash2 as Trash, CheckCircle, ShoppingBag, AlertCircle } from "lucide-react";

const Checkout = () => {
  const { cart, updateCartItem, setCart, clearCart } = useCart();
  const cartItems = (cart && cart.items) || [];

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const token = localStorage.getItem("token");
  const studentStatus = localStorage.getItem("studentStatus") || "non-student";

  const getItemPrice = (item) =>
    token && studentStatus === "student"
      ? item.discounted_price_for_LUMS_student
      : item.price;

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + getItemPrice(item) * item.quantity, 0);

  const handleIncrease = (itemId, quantity) => updateCartItem(itemId, quantity + 1);
  const handleDecrease = (itemId, quantity) => {
    if (quantity > 1) updateCartItem(itemId, quantity - 1);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/cart/item/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setCart(data.cart);
      else console.error("Delete error:", data.message);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!token) return setShowLoginModal(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrderPlaced(true);
        setCart({ items: [] });
        setTimeout(() => setOrderPlaced(false), 3000);
      } else console.error(data.message);
    } catch (err) {
      console.error("Order error:", err);
    }
  };

  return (
    <div className="bg-restaurant-primary min-h-screen py-8 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  <div className="divide-y divide-gray-700 space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.item_id}
                        className="flex justify-between items-center py-2"
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            Unit: PKR {getItemPrice(item)} | Subtotal: PKR{" "}
                            {getItemPrice(item) * item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item.item_id, item.quantity)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleIncrease(item.item_id, item.quantity)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.item_id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div>
              <div className="bg-gray-900 rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>PKR {getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>PKR 100.00</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3 mt-3 text-white font-bold text-lg flex justify-between">
                    <span>Total</span>
                    <span>PKR {(getCartTotal() + 100).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-red-500 hover:bg-red-700 py-3 rounded-md font-medium text-white"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full mt-3 bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-md font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            {orderPlaced ? (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Order Placed Successfully!</h2>
                <p className="text-gray-300 max-w-md mx-auto">
                  Your order has been received and is being processed.
                </p>
                <div className="pt-6">
                  <Link
                    to="/orders"
                    className="inline-block px-6 py-3 bg-restaurant-accent text-white font-medium rounded-md hover:bg-red-700"
                  >
                    View My Orders
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
                <p className="text-gray-300 max-w-md mx-auto">
                  Looks like you haven't added any items to your cart yet. Browse our menu to find delicious food!
                </p>
                <div className="pt-6">
                  <Link
                    to="/menu"
                    className="inline-block px-6 py-3 text-white font-medium rounded-md bg-red-500 hover:bg-red-700"
                  >
                    Browse Menu
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onClose={() => setShowLoginModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              <Dialog.Title className="text-lg font-semibold text-black">Login Required</Dialog.Title>
            </div>
            <p className="text-gray-700 mb-6">Please login or create an account to complete your order.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                to="/"
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-restaurant-accent hover:bg-red-700"
              >
                Go to Login
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Checkout;
