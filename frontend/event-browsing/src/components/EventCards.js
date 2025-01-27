import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import useApi from '../hooks/useApi';

const EventCards = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetch } = useApi();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetch("/events");
        setLoading(false);
        setEvents(data);
      } catch (error) {
        setLoading(false);
        setError(error.message || "An error occured while fetching bookings.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [fetch]);

  return (
    <section className="container mx-auto p-4 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {
        error && (
          <div className='flex items-center justify-center'>{error.message}</div>
        )
      }
      { loading && events.length === 0 && (
          <div className='flex items-center justify-center'>Loading data</div>
        )}
      {events.length > 0 && events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
};

export default EventCards;
