// backend/app.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http'); // <-- add this
const { Server } = require('socket.io'); // <-- add this
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const rfpRoutes = require('./routes/rfp');
const algoliaSearchRoutes = require('./routes/algoliaSearch');
const rfpResponsesRoute = require('./routes/rfpResponses');
const rfpGet = require('./routes/rfpGet');
const subResponsesRoute = require('./routes/supResponses');

const RFPModel = require('./models/RFP');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/search', algoliaSearchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rfp', rfpRoutes);
app.use('/api/rfpRes', rfpResponsesRoute);
app.use('/api/subRes', subResponsesRoute);
app.use('/api/rfpGet', rfpGet);



// Serve React build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all for frontend, but ignore API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rfp_system';

// Create HTTP server instead of app.listen
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // your frontend origin
    methods: ["GET", "POST"]
  }
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Example event from client
  socket.on('sendNotification', (data) => {
    io.emit('receiveNotification', data); // send to all
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes if needed
app.set('io', io);

async function createTextIndex() {
  try {
    await RFPModel.collection.createIndex({ title: "text", description: "text" });
    console.log('Text index created on title and description');
  } catch (err) {
    console.error('Error creating text index:', err);
  }
}

// Connect DB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await createTextIndex();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Mongo connection error:', err));
