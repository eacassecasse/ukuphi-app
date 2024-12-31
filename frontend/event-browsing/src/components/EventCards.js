import React from 'react';
import EventCard from './EventCard'; 

const EventCards = () => {
  const events = [
    {
      id: 1,
      title: "Live Concert",
      location: "Maputo",
      date: "Jan 15, 2025",
      price: "$25",
      image: "https://images.unsplash.com/photo-1545328421-44f218f04c18?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxpdmUlMjBjb25jZXJ0fGVufDB8fDB8fHww",
      buttonText: "Buy Tickets",
    },
    {
      id: 2,
      title: "Sports Meetup",
      location: "Beira",
      date: "Feb 20, 2025",
      price: "$30",
      image: "https://images.unsplash.com/photo-1470468969717-61d5d54fd036?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnR8ZW58MHx8MHx8fDA%3D",
      buttonText: "Buy Tickets",
    },
    {
      id: 3,
      title: "Cultural Festival",
      location: "Nampula",
      date: "Mar 5, 2025",
      price: "$20",
      image: "https://plus.unsplash.com/premium_photo-1714618937899-86c698f792a3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3VsdHVyYWxsJTIwZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D",
      buttonText: "Buy Tickets",
    },
    {
      id: 3,
      title: "Music",
      location: "Nampula",
      date: "Mar 5, 2025",
      price: "$20",
      image: "https://plus.unsplash.com/premium_photo-1663126799096-9a656a1efe36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI1fHx8ZW58MHx8fHx8",
      buttonText: "Buy Tickets",
    },
    {
      id: 3,
      title: "Dance Festival",
      location: "Nampula",
      date: "Mar 8, 2025",
      price: "$20",
      image: "https://plus.unsplash.com/premium_photo-1719066378763-452e7629561d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZGFuY2UlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
      buttonText: "Buy Tickets",
    },
    {
      id: 3,
      title: "Folks ",
      location: "Nampula",
      date: "Mar 5, 2025",
      price: "$20",
      image: "https://images.unsplash.com/photo-1517024107137-32df51965b59?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZvbGtzfGVufDB8fDB8fHww",
      buttonText: "Buy Tickets",
    },
  ];

  return (
    <section className="container mx-auto p-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
};

export default EventCards;
