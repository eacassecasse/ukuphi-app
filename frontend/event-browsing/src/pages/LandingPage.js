import React from "react";
import HeroSection from "../components/HeroSection"; 
import SearchFilters from "../components/SearchFilters";

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Search Filters Section */}
      <SearchFilters />
    </div>
  );
};

export default LandingPage;
