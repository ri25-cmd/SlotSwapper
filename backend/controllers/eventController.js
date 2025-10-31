const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  const { title, startTime, endTime } = req.body;

  if (!title || !startTime || !endTime) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const event = new Event({
      user: req.user.id,
      title,
      startTime,
      endTime,
      status: 'BUSY', // Default status
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's events
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
  try {
    // This allows filtering by status, e.g., /my-events?status=SWAPPABLE
    const { status } = req.query;
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const events = await Event.find(query).sort({ startTime: 'asc' });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event (e.g., change status)
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event belongs to the user
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update fields
    event.title = title || event.title;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.status = status || event.status;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
};