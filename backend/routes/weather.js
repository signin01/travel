const express = require('express');
const weatherService = require('../services/weatherService');
const router = express.Router();

// Get weather for destination
router.get('/:destination', async (req, res) => {
    try {
        const weather = await weatherService.getWeather(req.params.destination);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get packing tips
router.get('/packing/:destination', async (req, res) => {
    try {
        const weather = await weatherService.getWeather(req.params.destination);
        res.json({ tips: weather.packingTips });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;