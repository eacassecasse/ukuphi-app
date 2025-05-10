import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event details');
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-2">Date: {event.date}</p>
          <p className="text-gray-600 mb-2">Time: {event.time}</p>
          <p className="text-gray-600 mb-2">Location: {event.location}</p>
          <p className="text-gray-600 mb-2">Price: {event.price}</p>
          <p className="text-gray-600 mb-4">Organizer: {event.organizer}</p>
          <p className="text-gray-700 mb-6">{event.description}</p>

          {/* Buy Tickets Button */}
          <Link to={`/purchase-ticket?eventId=${id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
              Buy Tickets
            </button>
          </Link>

          <div className="w-full h-64 mb-6">
            <iframe
              src={event.mapUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Event Location"
            ></iframe>
          </div>

          {/* Social Media Sharing */}
          <div className="flex space-x-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Share on Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
