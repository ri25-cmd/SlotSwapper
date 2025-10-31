import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const { data } = await api.get('/swaps/my-requests');
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch (err) {
      setError('Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, accepted) => {
    try {
      await api.post(`/swaps/swap-response/${requestId}`, { accepted });
      setMessage(`Request ${accepted ? 'accepted' : 'rejected'} successfully.`);
      fetchRequests(); // Refresh lists
    } catch (err) {
      setError('Failed to respond to request.');
    }
  };

  const RequestItem = ({ request, type }) => {
    const mySlot = type === 'incoming' ? request.receiverSlot : request.requesterSlot;
    const theirSlot = type === 'incoming' ? request.requesterSlot : request.receiverSlot;
    const otherUser = type === 'incoming' ? request.requester : request.receiver;

    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <p className="text-sm text-gray-500 mb-2">
          {type === 'incoming' ? 'From: ' : 'To: '}
          <span className="font-medium">{otherUser.name}</span>
           ({request.status})
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs font-semibold uppercase text-gray-500">
              {type === 'incoming' ? 'Your Slot' : 'Your Offer'}
            </p>
            <p className="font-medium">{mySlot.title}</p>
            <p className="text-sm text-gray-600">{new Date(mySlot.startTime).toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-xs font-semibold uppercase text-blue-500">
              {type === 'incoming' ? 'Their Offer' : 'Their Slot'}
            </p>
            <p className="font-medium">{theirSlot.title}</p>
            <p className="text-sm text-gray-600">{new Date(theirSlot.startTime).toLocaleString()}</p>
          </div>
        </div>
        {type === 'incoming' && request.status === 'PENDING' && (
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleResponse(request._id, true)}
              className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleResponse(request._id, false)}
              className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {error && <p className="text-red-500 md:col-span-2">{error}</p>}
      {message && <p className="text-green-500 md:col-span-2">{message}</p>}
      {loading && <p className="md:col-span-2">Loading requests...</p>}

      {/* Incoming Requests */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Incoming Requests</h2>
        <div className="space-y-4">
          {incoming.length > 0 ? (
            incoming.map((req) => (
              <RequestItem key={req._id} request={req} type="incoming" />
            ))
          ) : (
            <p className="text-gray-500">No incoming requests.</p>
          )}
        </div>
      </div>

      {/* Outgoing Requests */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Outgoing Requests</h2>
        <div className="space-y-4">
          {outgoing.length > 0 ? (
            outgoing.map((req) => (
              <RequestItem key={req._id} request={req} type="outgoing" />
            ))
          ) : (
            <p className="text-gray-500">No outgoing requests.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;