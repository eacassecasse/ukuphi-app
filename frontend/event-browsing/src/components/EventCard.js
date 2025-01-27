import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { format } from 'date-fns'


const EventCard = ({ event }) => {
  return (
    <div className="event-card border rounded-lg overflow-hidden shadow-lg">
      <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.location}</p>
        <p>{format(new Date(event.date),  'yyyy-MM-dd HH:mm')}</p>
        <p>{event.price}</p>
        <Link to={`/purchase-ticket?eventId=${event.id}&eventTitle=${event.title}&eventLocation=${event.location}&eventDate=${event.date}`}> 
          <button className="bg-blue-500 text-white px-4 py-2 mt-2 hover:bg-orange-700">
            Buy Ticket
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
