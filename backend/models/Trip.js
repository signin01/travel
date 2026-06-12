const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    budget: {
        type: Number,
        required: true
    },
    interests: String,
    cuisine: String,
    itinerary: String,
    startDate: Date,
    endDate: Date,
    isPublic: {
        type: Boolean,
        default: false
    },
    shareCode: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Generate share code before saving
tripSchema.pre('save', function(next) {
    if (this.isPublic && !this.shareCode) {
        this.shareCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Trip', tripSchema);