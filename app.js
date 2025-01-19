const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', transactionRoutes);

mongoose
    .connect('mongodb://localhost:27017/transactionsDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

module.exports = app;
