import React, { useEffect, useRef, useState } from 'react';
import './Menu.css';

const menuData = [
  { id: 1, name: 'Honey Wings (4 PCS.)', price: 900, category: 'Starters' },
  { id: 2, name: 'Chicken Drumsticks (4 PCS.)', price: 900, category: 'Starters' },
  { id: 3, name: 'Vegetable Spring Rolls (6 PCS.)', price: 600, category: 'Starters' },
  { id: 4, name: 'Schezwan Fried Chicken', price: 1200, category: 'Starters' },
  { id: 5, name: 'Steamed Dumpling (6 PCS.)', price: 900, category: 'Starters' },
  { id: 6, name: 'Tempura Prawns', price: 2400, category: 'Starters' },
  { id: 7, name: 'Stuffed Chili Prawns', price: 2400, category: 'Starters' },
  { id: 8, name: 'Crispy Fried Prawns', price: 2400, category: 'Starters' },
  { id: 9, name: 'Explosive Prawns', price: 2400, category: 'Starters' },

  { id: 10, name: 'Zaan Special Soup', price: 500, category: 'Soups' },
  { id: 11, name: 'Chicken Corn Soup', price: 400, category: 'Soups' },
  { id: 12, name: 'Hot & Sour Soup', price: 400, category: 'Soups' },

  { id: 13, name: 'Chicken Manchurian', price: 900, category: 'Chinese' },
  { id: 14, name: 'Schezwan Chicken', price: 1200, category: 'Chinese' },
  { id: 15, name: 'Sweet & Sour Chicken', price: 1200, category: 'Chinese' },
  { id: 16, name: 'Kung Pao Chicken', price: 1200, category: 'Chinese' },
  { id: 17, name: 'Chicken Chili Dry', price: 1200, category: 'Chinese' },
  { id: 18, name: 'Black Pepper Chicken', price: 1200, category: 'Chinese' },
  { id: 19, name: 'Zaan Special Rice', price: 750, category: 'Chinese' },
  { id: 20, name: 'Zaan Chowmein', price: 600, category: 'Chinese' },

  { id: 21, name: 'Spicy Chicken Cheese Steak Sandwich', price: 950, category: 'Sandwiches' },
  { id: 22, name: 'Pesto Grilled Chicken Sandwich', price: 950, category: 'Sandwiches' },
  { id: 23, name: 'Philly Cheese Steak Sandwich', price: 1050, category: 'Sandwiches' },
  { id: 24, name: 'Zaan Classic Club Sandwich', price: 950, category: 'Sandwiches' },
  { id: 25, name: 'Chicken Tikka Panini', price: 850, category: 'Sandwiches' },
  { id: 26, name: 'Grilled Chicken Panini', price: 850, category: 'Sandwiches' },

  { id: 27, name: 'Fiery Crispy Chicken Burger', price: 950, category: 'Burgers' },
  { id: 28, name: 'Crispy Chicken Slider', price: 950, category: 'Burgers' },
  { id: 29, name: 'Zaan Mighty Crunch Burger', price: 1050, category: 'Burgers' },
  { id: 30, name: 'Smash Beef Burger', price: 1050, category: 'Burgers' },

  { id: 31, name: 'Soft Drinks', price: 70, category: 'Drinks' },
  { id: 32, name: 'Cola Next', price: 70, category: 'Drinks' },
  { id: 33, name: 'Coca Cola', price: 70, category: 'Drinks' },
  { id: 34, name: 'Water Bottle', price: 70, category: 'Drinks' },
];

const categories = ['All', 'Starters', 'Soups', 'Chinese', 'Sandwiches', 'Burgers', 'Drinks'];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSelectedCategory(entry.target.dataset.category);
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(sectionRefs.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = category => {
    setSelectedCategory(category);
    if (category === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      sectionRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const groupedItems = menuData.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Delicious Menu</h2>

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => scrollToSection(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {categories.filter(cat => cat !== 'All').map(cat => (
        <div key={cat} className="menu-section" ref={el => (sectionRefs.current[cat] = el)} data-category={cat}>
          <h3 className="section-heading">{cat}</h3>
          <div className="menu-items">
            {groupedItems[cat]?.map(item => (
              <div className="menu-card" key={item.id}>
                <img
                  src="/BeefChilliDry.jpeg"
                  alt={item.name}
                  className="menu-card-image"
                />
                <div className="menu-card-details">
                  <h4>{item.name}</h4>
                  <p className="menu-card-desc">This is a sample description.</p>
                  <p className="menu-card-price">PKR {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;