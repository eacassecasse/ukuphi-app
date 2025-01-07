import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import EventsList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import TicketPurchase from "./pages/TicketPurchase";

function App() {
  return (
    <Router>
      <div className="bg-blue-100 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<EventsList />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/purchase-ticket" element={<TicketPurchase />} />

          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  ); 
}

export default App;
