// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('PixelForge Nexus API is running!');
});

// Define Routes
app.use('/api/users', require('./routes/users'));
// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// Define Routes
app.use('/api/documents', require('./routes/documents'));
// ... other app.use routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});