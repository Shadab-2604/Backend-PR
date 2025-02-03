require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = require('./src/app');
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
