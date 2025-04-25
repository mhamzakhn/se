import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const { setCart, addItemToCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRecentOrders = async () => {
    try {
      clearCart();
      const response = await fetch(
        "http://localhost:4000/api/v1/orders/recent",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to fetch recent orders:", data.message);
        return;
      }

      const { order } = data;

      if (order && order.items) {
        for (const item of order.items) {
          console.log(item);
          await addItemToCart(item);
        }

        navigate("/checkout");
      } else {
        console.log("No recent orders found.");
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const handleOrderNow = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/menu");
    } else {
      openLoginModal();
    }
  };

  return (
    <section
      className="relative w-full h-[90vh] flex items-center justify-start bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/frontpage.png")' }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10" />

      <div className="relative z-20 px-6 md:px-20 lg:px-32 text-white max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md leading-tight">
          Welcome!
        </h1>
        <p className="text-lg sm:text-xl mb-8 drop-shadow-sm">
          We Make Delicious Food for You
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleOrderNow}
            className="bg-primaryred bg-red-500 hover:bg-red-700 px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-transform duration-200 hover:scale-105"
          >
            Order Now
          </button>

          {isAuthenticated && (
            <button
              onClick={handleRecentOrders}
              className="bg-blue-900 hover:bg-blue-950 px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-transform duration-200 hover:scale-105"
            >
              Recent Orders
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
