const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['food', 'hotel', 'transport', 'attraction', 'shopping', 'other'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    receipt: String
});

module.exports = mongoose.model('Expense', expenseSchema);
