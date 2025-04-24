// src/pages/Checkout.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import { Minus, Plus, Trash2 as Trash, CheckCircle } from "lucide-react";

const Checkout = () => {
  const { cart, updateCartItem, setCart } = useCart();
  const cartItems = (cart && cart.items) || [];

  const token = localStorage.getItem("token");
  const studentStatus = localStorage.getItem("studentStatus") || "non-student";

  const getItemPrice = (item) => {
    return token && studentStatus === "student"
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
    }
  };

  const handleDeleteItem = async (itemId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/cart/item/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        console.error("Error deleting cart item:", data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User must be logged in to place an order.");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/api/v1/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error placing order:", data.message);
      } else {
        alert("Order placed successfully!");
        console.log("Order placed successfully:", data.order);
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="bg-restaurant-primary min-h-screen py-10 px-6 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {token && studentStatus === "student" && (
          <p className="text-green-400 text-sm mb-4">Discounted prices applied</p>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-gray-300">Add items from the menu to place an order.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.item_id}
                  className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Unit: PKR {getItemPrice(item)} | Subtotal: PKR{" "}
                      {getItemPrice(item) * item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item.item_id, item.quantity)}
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.item_id, item.quantity)}
                      className="p-2 rounded bg-gray-700 hover:bg-gray-600"
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

            <div className="mt-8 border-t border-gray-700 pt-4">
              <h2 className="text-2xl font-semibold">Total: PKR {getCartTotal()}</h2>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 w-full bg-restaurant-accent hover:bg-red-700 text-white py-3 rounded-md font-medium"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
