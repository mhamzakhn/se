import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-[90vh] flex items-center justify-start bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/frontpage.png")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 px-6 md:px-20 lg:px-32 text-white max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-md leading-tight">
          Welcome!
        </h1>
        <p className="text-lg sm:text-xl mb-8 drop-shadow-sm">
          We Make Delicious Food for You
        </p>
        <button className="bg-primaryred bg-red-500 hover:bg-red-700 px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-transform duration-200 hover:scale-105">
          Order Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
