const express = require('express');
const Trip = require('../models/Trip');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Create a new trip
router.post('/', verifyToken, async (req, res) => {
    try {
        const trip = new Trip({
            userId: req.userId,
            ...req.body
        });
        await trip.save();
        
        // Update user's trip count
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.userId, { $inc: { tripsCount: 1 } });
        
        res.json({ success: true, trip });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all trips for current user
router.get('/my-trips', verifyToken, async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single trip
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update trip
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete trip
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Share trip (make public)
router.post('/:id/share', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isPublic: true },
            { new: true }
        );
        res.json({ shareCode: trip.shareCode, url: `/share/${trip.shareCode}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get public trip by share code
router.get('/share/:code', async (req, res) => {
    try {
        const trip = await Trip.findOne({ shareCode: req.params.code, isPublic: true });
        if (!trip) {
            return res.status(404).json({ error: 'Shared trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;