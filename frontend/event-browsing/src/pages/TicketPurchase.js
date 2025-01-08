import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TicketPurchase = () => {
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setTicketQuantity(e.target.value);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    alert('Ticket purchase confirmed! 🎉');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">
        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Ukuphi Live Concert</h1>
          <p className="text-gray-700 text-lg">Venue: Maputo Cultural Center</p>
          <p className="text-gray-700 text-lg">Date: January 15, 2025</p>
          <p className="text-gray-700 text-lg">Time: 7:00 PM</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticket Quantity
          </label>
          <input
            type="number"
            min="1"
            value={ticketQuantity}
            onChange={handleQuantityChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 mt-2 text-lg">Price per ticket: $20</p>
          <p className="font-semibold text-gray-700 text-xl">
            Total: ${ticketQuantity * 20}
          </p>
        </div>

        <form onSubmit={handlePurchase}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Details
          </label>
          <input
            type="text"
            placeholder="Card Number"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Name on Card"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="month"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Confirm Purchase
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/create-event" className="text-blue-500 hover:underline text-lg">
            Go to Event Creation
          </Link>
          <span className="mx-3 text-gray-500">|</span>
          <Link to="/events" className="text-blue-500 hover:underline text-lg">
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;

