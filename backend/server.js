const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import socket.io

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const swapRoutes = require('./routes/swapRoutes');

const app = express();
const server = http.createServer(app); // Create an HTTP server from the app

// Attach socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
  },
});

// --- Socket.io Logic ---
let onlineUsers = {}; // Maps userId to socketId

const addNewUser = (userId, socketId) => {
  if (userId) {
    onlineUsers[userId] = socketId;
  }
};

const removeUser = (socketId) => {
  onlineUsers = Object.fromEntries(
    Object.entries(onlineUsers).filter(([, sId]) => sId !== socketId)
  );
};

io.on('connection', (socket) => {
  console.log('A user connected.', socket.id);

  // Listen for a user to identify themselves
  socket.on('addNewUser', (userId) => {
    addNewUser(userId, socket.id);
    console.log('Online users:', onlineUsers);
  });

  // Listen for disconnect
  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('A user disconnected.', socket.id);
    console.log('Online users:', onlineUsers);
  });
});
// --- End Socket.io Logic ---


const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to attach io and onlineUsers to every request
// This lets our controllers access them
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

app.get('/', (req, res) => {
  res.send('SlotSwapper API is running!');
});

// Start the server using server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});