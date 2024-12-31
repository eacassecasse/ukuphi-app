import React from 'react';

const HeroSection = () => {
  return (
    <div
      className="hero bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/hero-image.jpg')" }}
    >
      <div className="container mx-auto text-center text-white p-20">
        <h1 className="text-4xl font-bold mb-4">Discover Exciting Events Near You</h1>

        {/* Animated Words with Bounce and Grow-Shrink will implement it later this this night or tomorrow */}
        <p className="text-lg mb-8">
          <span className="animate-bounceAndGrow mr-4">Music</span>
          <span className="animate-bounceAndGrow mr-4">Sports</span>
          <span className="animate-bounceAndGrow mr-4">Cultural</span>
          <span className="animate-bounceAndGrow mr-4">Corporate</span>
          <span className="animate-bounceAndGrow">Dance</span>
        </p>

        <a href="#events" className="btn-primary">
          Browse Events
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
