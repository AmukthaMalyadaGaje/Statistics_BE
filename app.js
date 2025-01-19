const cors = require('cors');
const express = require('express');
const app = express();


// Enable CORS for requests from http://localhost:5173 (or all origins)
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the React app
    methods: ['GET', 'POST'], // Allow specific methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers if needed
}));

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(bodyParser.json());
app.use('/api', transactionRoutes);

mongoose
    .connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = app;
