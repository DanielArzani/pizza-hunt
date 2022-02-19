// Dependencies
const express = require('express');
const mongoose = require('mongoose');

// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Global  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route Middleware
app.use(require('./routes'));

// Connect to DB
//mongoose.connect() tells Mongoose which database we want to connect to. If the environment variable MONGODB_URI exists, like on Heroku when we deploy later, it will use that. Otherwise, it will short-circuit to the local MongoDB server's database at mongodb://localhost:27017/pizza-hunt
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt'
);

// Use this to log mongo queries being executed!
// mongoose.set('debug', true);

// Listen for PORT
app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
