import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome!</h1>
        <p>We Made Delicious Food for You</p>
        <div className="hero-buttons">
          <button className="hero-btn delivery-btn">Delivery</button>
          <button className="hero-btn pickup-btn">Pickup</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;