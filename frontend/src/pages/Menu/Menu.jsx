// src/components/Menu.jsx (MenuPage)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Menu.css';

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
        if (!response.ok) {
          throw new Error("Error fetching the menu");
        }
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

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  // When the cart button for an item is clicked:
  const handleAddToCart = (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      openLogin();
      return;
    }
    addItemToCart(item);
  };

  const renderMenuCard = (item) => {
    const token = localStorage.getItem('token');
    const studentStatus = localStorage.getItem('studentStatus') || 'non-student';

    const priceToDisplay = token
      ? (studentStatus === 'student' ? item.discounted_price_for_LUMS_student : item.price)
      : item.price;

    return (
    <div className="menu-card" key={item.item_id || item.id}>
      <img
        src="/BeefChilliDry.jpeg"
        alt={item.name}
        className="menu-card-image"
      />
      <div className="menu-card-details">
        <h4>{item.name}</h4>
        <p className="menu-card-desc">This is a sample description.</p>
        <p className="menu-card-price">PKR {priceToDisplay}</p>
      </div>
      <div className="menu-card-cart-icon">
        <button className="cart-icon" onClick={() => handleAddToCart(item)}>
          <FaShoppingCart size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
};

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Delicious Menu</h2>
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {selectedCategory === 'All' ? (
        categories
          .filter((cat) => cat !== 'All')
          .map((cat) => (
            <div key={cat} className="menu-section" data-category={cat}>
              <h3 className="section-heading">{cat}</h3>
              <div className="menu-items">
                {groupedItems[cat] && groupedItems[cat].map(renderMenuCard)}
              </div>
            </div>
          ))
      ) : (
        <div className="menu-section" data-category={selectedCategory}>
          <h3 className="section-heading">{selectedCategory}</h3>
          <div className="menu-items">
            {groupedItems[selectedCategory] && groupedItems[selectedCategory].map(renderMenuCard)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
