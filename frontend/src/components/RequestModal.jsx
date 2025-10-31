import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RequestModal = ({ show, onClose, onConfirm, theirSlot }) => {
  const [mySwappableSlots, setMySwappableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      // Reset state when modal opens
      setSelectedSlotId('');
      setError('');
      setLoading(true);

      // Fetch user's own swappable slots
      const fetchMySlots = async () => {
        try {
          const { data } = await api.get('/events/my-events?status=SWAPPABLE');
          setMySwappableSlots(data);
        } catch (err) {
          setError('Could not fetch your slots.');
        } finally {
          setLoading(false);
        }
      };
      fetchMySlots();
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setError('Please select a slot to offer.');
      return;
    }
    onConfirm(selectedSlotId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Request Swap</h2>
        <p className="mb-2 text-gray-700">You are requesting to swap for:</p>
        <div className="bg-gray-100 p-3 rounded mb-4 border">
          <p className="font-semibold">{theirSlot.title}</p>
          <p className="text-sm text-gray-600">
            {new Date(theirSlot.startTime).toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="my-slot" className="block text-sm font-medium text-gray-700 mb-2">
            Choose one of your "Swappable" slots to offer:
          </label>
          {loading && <p>Loading your slots...</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {mySwappableSlots.length > 0 ? (
            <select
              id="my-slot"
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">-- Please select a slot --</option>
              {mySwappableSlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.title} ({new Date(slot.startTime).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 text-sm">
              You have no "Swappable" slots available. Go to your Dashboard to mark one.
            </p>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSlotId || loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;