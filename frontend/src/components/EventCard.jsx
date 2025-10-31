import React from 'react';

// NEW: A better date formatter
const formatDate = (dateString) => {
  const options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'SWAPPABLE':
      return 'bg-green-100 text-green-800';
    case 'SWAP_PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'BUSY':
    default:
      return 'bg-red-100 text-red-800';
  }
};

const EventCard = ({ event, children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-indigo-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </div>
      
      {/* NEW: Cleaned up date/time display */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">From:</span> {formatDate(event.startTime)}
        </p>
        <p>
          <span className="font-medium">To:</span> {formatDate(event.endTime)}
        </p>
      </div>

      {/* NEW: Only show the owner if the 'user' object exists (i.e., on the Marketplace) */}
      {event.user && event.user.name && (
        <p className="text-sm text-gray-500 mt-2 pt-2 border-t">
          Owner: {event.user.name}
        </p>
      )}

      {/* Child buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
        {children}
      </div>
    </div>
  );
};

export default EventCard;