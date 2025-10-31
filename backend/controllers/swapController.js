const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Get all swappable slots (not mine)
// @route   GET /api/swaps/swappable-slots
// @access  Private
const getSwappableSlots = async (req, res) => {
  try {
    // --- THIS IS THE NEW DEBUGGING LINE ---
    console.log(`User ${req.user.id} is fetching swappable slots...`);
    // -------------------------------------

    const slots = await Event.find({
      status: 'SWAPPABLE',
      user: { $ne: req.user.id }, // $ne means "not equal"
    }).populate('user', 'name email'); // Populate user info

    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new swap request
// @route   POST /api/swaps/swap-request
// @access  Private
const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  
  // Get socket.io instance from the request
  const { io, onlineUsers } = req;

  try {
    // --- Validation ---
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ message: 'One or more slots not found' });
    }
    if (mySlot.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'mySlot is not owned by you' });
    }
    if (theirSlot.user.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot swap with yourself' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Both slots must be "SWAPPABLE"' });
    }
    // --- End Validation ---

    // Create the swap request
    const swapRequest = await SwapRequest.create({
      requester: req.user.id,
      receiver: theirSlot.user,
      requesterSlot: mySlotId,
      receiverSlot: theirSlotId,
      status: 'PENDING',
    });

    // Update both slots to SWAP_PENDING
    await Event.updateMany(
      { _id: { $in: [mySlotId, theirSlotId] } },
      { status: 'SWAP_PENDING' }
    );

    // --- NEW SOCKET.IO LOGIC ---
    const receiverId = theirSlot.user.toString();
    const receiverSocketId = onlineUsers[receiverId];
    
    if (receiverSocketId) {
      console.log(`Sending notification to receiver: ${receiverId} at socket: ${receiverSocketId}`);
      io.to(receiverSocketId).emit('getNotification', {
        message: `You have a new swap request from ${req.user.name}!`,
      });
    }
    // --- END NEW LOGIC ---

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to a swap request
// @route   POST /api/swaps/swap-response/:requestId
// @access  Private
const respondToSwapRequest = async (req, res) => {
  const { requestId } = req.params;
  const { accepted } = req.body; // true or false

  // Get socket.io instance from the request
  const { io, onlineUsers } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const swapRequest = await SwapRequest.findById(requestId).session(session);

    if (!swapRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if I am the receiver
    if (swapRequest.receiver.toString() !== req.user.id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: 'Not authorized to respond' });
    }
    
    // Check if already responded
    if (swapRequest.status !== 'PENDING') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Swap already responded to' });
    }

    const requesterSlot = await Event.findById(swapRequest.requesterSlot).session(session);
    const receiverSlot = await Event.findById(swapRequest.receiverSlot).session(session);

    if (!requesterSlot || !receiverSlot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'One or more slots deleted' });
    }

    if (accepted) {
      // --- ACCEPTED ---
      swapRequest.status = 'ACCEPTED';

      // The core swap: Exchange the owners
      requesterSlot.user = swapRequest.receiver; // I get the requester's slot
      receiverSlot.user = swapRequest.requester; // The requester gets my slot

      // Set status back to BUSY
      requesterSlot.status = 'BUSY';
      receiverSlot.status = 'BUSY';

      await requesterSlot.save({ session });
      await receiverSlot.save({ session });
    } else {
      // --- REJECTED ---
      swapRequest.status = 'REJECTED';

      // Set status back to SWAPPABLE
      requesterSlot.status = 'SWAPPABLE';
      receiverSlot.status = 'SWAPPABLE';
      
      await requesterSlot.save({ session });
      await receiverSlot.save({ session });
    }

    await swapRequest.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    // --- NEW SOCKET.IO LOGIC ---
    const requesterId = swapRequest.requester.toString();
    const requesterSocketId = onlineUsers[requesterId];

    if (requesterSocketId) {
      console.log(`Sending response to requester: ${requesterId} at socket: ${requesterSocketId}`);
      io.to(requesterSocketId).emit('getResponse', {
        message: `Your swap for "${requesterSlot.title}" was ${accepted ? 'accepted' : 'rejected'}!`,
      });
    }
    // --- END NEW LOGIC ---

    res.json(swapRequest);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get my incoming and outgoing swap requests
// @route   GET /api/swaps/my-requests
// @access  Private
const getMySwapRequests = async (req, res) => {
  try {
    const incoming = await SwapRequest.find({
      receiver: req.user.id,
      status: 'PENDING',
    })
      .populate('requester', 'name email')
      .populate('requesterSlot')
      .populate('receiverSlot');

    const outgoing = await SwapRequest.find({ requester: req.user.id })
      .populate('receiver', 'name email')
      .populate('requesterSlot')
      .populate('receiverSlot');

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getSwappableSlots,
  createSwapRequest,
  respondToSwapRequest,
  getMySwapRequests,
};