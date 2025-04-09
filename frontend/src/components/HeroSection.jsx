import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome!</h1>
        <p>We Made Delicious Food for You</p>
        <div className="hero-buttons">
          <button className="hero-btn delivery-btn">Order Now</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;