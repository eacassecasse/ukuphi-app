import React from 'react';

const HeroSection = () => {
  return (
    <div
      className="hero bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/hero-image.jpg')" }}
    >
      <div className="container mx-auto text-center text-white p-20">
        <h1 className="text-4xl font-bold mb-4">Discover Exciting Events Near You</h1>
        <p className="text-lg mb-8">
          Find and book tickets for music, sports, cultural, and corporate events.
        </p>
        <a href="#events" className="btn-primary">
          Browse Events
        </a>
      </div>
    </div>
  );
};

export default HeroSection; 
