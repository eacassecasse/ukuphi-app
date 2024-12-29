import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";
import EventsList from "./pages/EventList";
import EventCards from "./components/EventCards"; 
import EventDetail from "./pages/EventDetail";
import AboutUs from "./pages/AboutUs"; 
import Blog from "./pages/Blog";
import Contact from "./pages/Contact"; 
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        
        {/* Main Routes for Pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>

        {/* more Content*/}
        <EventCards />
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
