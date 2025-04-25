import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Starters', 'Soups', 'Chinese', 'Sandwiches', 'Burgers', 'Drinks'];

const MenuPage = ({ openLogin }) => {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addItemToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/menu')
      .then((response) => {
        if (!response.ok) throw new Error("Error fetching the menu");
        return response.json();
      })
      .then((data) => setMenuData(data))
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setError("Error fetching menu.");
      });
  }, []);

  const groupedItems = menuData.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleCategoryChange = (cat) => setSelectedCategory(cat);

  const handleAddToCart = (item) => {
    const token = localStorage.getItem('token');
    if (!token) return openLogin();
    addItemToCart(item);
  };

  const renderMenuCard = (item) => {
    const token = localStorage.getItem('token');
    const studentStatus = localStorage.getItem('studentStatus') || 'non-student';
    const priceToDisplay = token && studentStatus === 'student' ? item.discounted_price_for_LUMS_student : item.price;
  
    return (
      <div key={item.item_id || item.id} className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden relative hover:scale-105 transition-all duration-300">
        <img src="/BeefChilliDry.jpeg" alt={item.name} className="w-full h-48 object-contain bg-gray-800" />
        <div className="p-4">
          <h4 className="text-lg font-semibold text-white mb-1">{item.name}</h4>
          <p className="text-sm text-gray-400 mb-2">This is a sample description.</p>
          <p className="text-white font-bold text-sm">PKR {priceToDisplay}</p>
        </div>
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => handleAddToCart(item)}
            className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition-transform duration-200 hover:bg-gray-400 hover:scale-110"
            title="Add Item"
          >
            +
          </button>
        </div>
      </div>
    );
  };  

  if (error) return <div className="text-white text-center mt-10">{error}</div>;

  return (
    <div className="bg-restaurant-primary min-h-screen py-16 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-12">Our Delicious Menu</h2>

      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-white text-gray-900 shadow'
                : 'border-white text-white hover:bg-white hover:text-gray-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory === 'All'
        ? categories.filter((cat) => cat !== 'All').map((cat) => (
            <div key={cat} className="mb-16">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedItems[cat] && groupedItems[cat].map(renderMenuCard)}
              </div>
            </div>
          ))
        : (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">{selectedCategory}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedItems[selectedCategory] && groupedItems[selectedCategory].map(renderMenuCard)}
            </div>
          </div>
        )}
    </div>
  );
};

export default MenuPage;