import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import './Menu.css';

const categories = ['All', 'Starters', 'Soups', 'Chinese', 'Sandwiches', 'Burgers', 'Drinks'];

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/menu')
      .then((response) => response.json())
      .then((data) => setMenuData(data))
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);

  const groupedItems = menuData.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  const renderMenuCard = (item) => (
    <div className="menu-card" key={item.item_id || item.id}>
      <img
        src="/BeefChilliDry.jpeg"
        alt={item.name}
        className="menu-card-image"
      />
      <div className="menu-card-details">
        <h4>{item.name}</h4>
        <p className="menu-card-desc">This is a sample description.</p>
        <p className="menu-card-price">PKR {item.price}</p>
        <p className="menu-card-price">
          Discounted Price: PKR {item.discounted_price_for_LUMS_student}
        </p>
      </div>
      <div className="menu-card-cart-icon">
        <Link to="/cart" className="cart-icon">
          <FaShoppingCart size={20} color="#fff" />
        </Link>
      </div>
    </div>
  );

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

export default Menu;
