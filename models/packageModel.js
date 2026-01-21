const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        // enum: ['Honeymoon', 'College', 'Office', 'Family', 'Other'] // Optional: restrict if needed, but user list implied open-ended with examples
    },
    availableNumbers: {
        type: Number,
        default: 0
    },
    scope: { // International / Domestic
        type: String,
        required: true,
        enum: ['International', 'Domestic']
    },
    regions: {
        type: [String], // Array of regions
        default: []
    },
    images: {
        type: [String], // Array of image URLs
        default: []
    },
    days: [daySchema], // Array of day details
    pdf: {
        type: String // URL to PDF
    },
    isDisable: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
