// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Load environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch weather data
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    const weatherData = response.data;

    res.json({
      city: weatherData.name,
      temperature: weatherData.main.temp,
      condition: weatherData.weather[0].description,
      windSpeed: weatherData.wind.speed,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
});

// Route to handle root ("/") requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  