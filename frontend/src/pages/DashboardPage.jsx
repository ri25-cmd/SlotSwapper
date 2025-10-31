import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { PlusIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events/my-events');
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) {
      setError('Please fill all fields.');
      return;
    }
    setError('');
    try {
      await api.post('/events', { title, startTime, endTime });
      // Reset form and refetch events
      setTitle('');
      setStartTime('');
      setEndTime('');
      fetchEvents();
    } catch (err) {
      setError('Failed to create event.');
    }
  };

  const handleStatusChange = async (event, newStatus) => {
    try {
      await api.put(`/events/${event._id}`, { status: newStatus });
      fetchEvents(); // Refetch to show updated status
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Create Event Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PlusIcon className="h-6 w-6 mr-2" />
            Create New Event
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleCreateEvent}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>

      {/* My Events List */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">My Calendar</h2>
        {loading && <p>Loading your events...</p>}
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event._id} event={event}>
                {/* Buttons to change status */}
                {event.status === 'BUSY' && (
                  <button
                    onClick={() => handleStatusChange(event, 'SWAPPABLE')}
                    className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
                  >
                    Make Swappable
                  </button>
                )}
                {event.status === 'SWAPPABLE' && (
                  <button
                    onClick={() => handleStatusChange(event, 'BUSY')}
                    className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
                  >
                    Make Busy
                  </button>
                )}
                {event.status === 'SWAP_PENDING' && (
                  <span className="text-sm text-yellow-600">
                    Pending Swap...
                  </span>
                )}
              </EventCard>
            ))
          ) : (
            <p className="text-gray-500">You have no events. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;