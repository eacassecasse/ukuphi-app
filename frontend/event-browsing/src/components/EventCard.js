import React from "react";
import { Link } from "react-router-dom"; // Import Link

const EventCard = ({ event }) => {
  return (
    <div className="event-card border rounded-lg overflow-hidden shadow-lg">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.location}</p>
        <p>{event.date}</p>
        <p>{event.price}</p>
        <Link to={`/purchase-ticket?eventId=${event.id}`}> 
          <button className="bg-blue-500 text-white px-4 py-2 mt-2 hover:bg-orange-700">
            {event.buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
