import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import RequestModal from '../components/RequestModal';
import toast from 'react-hot-toast'; // Import react-hot-toast
import { ShoppingBagIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // <-- This is the import you were missing

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-12">
    <ArrowPathIcon className="h-10 w-10 text-indigo-600 animate-spin" />
  </div>
);

// Your new empty state component (it's perfect)
const EmptyMarketplace = () => (
  <div className="text-center bg-white p-12 rounded-lg shadow border">
    <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">Marketplace is Empty</h3>
    <p className="mt-1 text-sm text-gray-500">
      There are no swappable slots available from other users right now.
    </p>
  </div>
);

const MarketplacePage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Removed 'message' and 'error' states to use toast
  
  const fetchSwappableSlots = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/swaps/swappable-slots');
      setSlots(data);
    } catch (err) {
      toast.error('Failed to fetch swappable slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const handleRequestClick = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  const handleConfirmSwap = async (mySlotId) => {
    try {
      await api.post('/swaps/swap-request', {
        mySlotId: mySlotId,
        theirSlotId: selectedSlot._id,
      });
      
      toast.success('Swap request sent successfully!');
      
      handleModalClose();
      fetchSwappableSlots(); // Re-fetch slots
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send swap request.');
      handleModalClose();
    }
  };

  // Helper function to render the main content
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    // Your code was perfect, just needed the import
    if (slots.length === 0) {
      return <EmptyMarketplace />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <EventCard key={slot._id} event={slot}>
            <button
              onClick={() => handleRequestClick(slot)}
              className="bg-indigo-600 text-white text-sm py-1 px-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Request Swap
            </button>
          </EventCard>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
      <p className="text-gray-600 mb-6">Here are all the slots available for swapping.</p>
      
      {/* Static message/error divs are removed */}
      
      {renderContent()}

      {selectedSlot && (
        <RequestModal
          show={showModal}
          onClose={handleModalClose}
          onConfirm={handleConfirmSwap}
          theirSlot={selectedSlot}
        />
      )}
    </div>
  );
};

export default MarketplacePage;