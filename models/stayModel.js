const mongoose = require('mongoose');

const staySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true,
        trim: true
    },
    propertyPhone: {
        type: String,
    },
    propertyEmail: {
        type: String,
        lowercase: true,
        trim: true
    },
    maxGuests: {
        type: Number,
        default: 0
    },
    purchasePrice: { // Resort Purchase Price – B2B Price
        type: Number,
    },
    sellingPrice: { // Resort Selling Price (₹) – B2C Price
        type: Number,
    },
    district: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    propertyDescription: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String], // Select from preset amenities
        default: []
    },
    googleMapsLink: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Stay', staySchema);
