// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Currency rates endpoint
app.get('/api/currency-rates', async (req, res) => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        res.json(data.rates);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch currency rates' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
