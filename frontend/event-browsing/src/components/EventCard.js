import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="event-card border rounded-lg overflow-hidden shadow-lg">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p>{event.location}</p>
        <p>{event.date}</p>
        <p>{event.price}</p>
        <button className="bg-blue-500 text-white px-4 py-2 mt-2">{event.buttonText}</button>
      </div>
    </div>
  );
};

export default EventCard;
