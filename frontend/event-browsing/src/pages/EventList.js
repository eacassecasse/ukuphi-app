import React from "react";
import EventCards from "../components/EventCards";

const EventList = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
        <EventCards />
      </div>
    </div>
  );
};

export default EventList;
