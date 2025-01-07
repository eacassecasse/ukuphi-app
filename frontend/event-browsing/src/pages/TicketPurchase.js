import React, { useState } from "react";
import { Link } from "react-router-dom";

const TicketPurchase = () => {
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setTicketQuantity(e.target.value);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    alert("Ticket purchase confirmed! 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        {/* Event Details */}
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Ukuphi Live Concert</h1>
          <p className="text-gray-600">Venue: Maputo Cultural Center</p>
          <p className="text-gray-600">Date: January 15, 2025</p>
          <p className="text-gray-600">Time: 7:00 PM</p>
        </div>

        {/* Ticket Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticket Quantity
          </label>
          <input
            type="number"
            min="1"
            value={ticketQuantity}
            onChange={handleQuantityChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-gray-500 mt-2">Price per ticket: $20</p>
          <p className="font-bold text-gray-700">
            Total: ${ticketQuantity * 20}
          </p>
        </div>

        {/* Payment Section */}
        <form onSubmit={handlePurchase}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Details
          </label>
          <input
            type="text"
            placeholder="Card Number (mock input)"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="Name on Card"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <input
            type="month"
            placeholder="Expiry Date"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Confirm Purchase
          </button>
        </form>

        {/* Navigation Links */}
        <div className="mt-6 text-center">
          <Link to="/create-event" className="text-blue-500 hover:underline">
            Go to Event Creation
          </Link>
          <span className="mx-2 text-gray-500">|</span>
          <Link to="/events" className="text-blue-500 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;
