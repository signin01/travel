const express = require('express');
const flightService = require('../services/flightService');
const router = express.Router();

// Get flights for destination
router.get('/:destination', async (req, res) => {
    try {
        const { budget } = req.query;
        const flights = await flightService.getFlights(req.params.destination);
        
        if (budget) {
            const alert = await flightService.getPriceAlert(req.params.destination, parseInt(budget));
            flights.priceAlert = alert;
        }
        
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get price alert
router.get('/alert/:destination', async (req, res) => {
    try {
        const { budget } = req.query;
        const alert = await flightService.getPriceAlert(req.params.destination, parseInt(budget));
        res.json(alert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;