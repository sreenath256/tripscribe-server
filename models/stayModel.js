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
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    propertyDescription: {
        type: String,
        required: true
    },
    mainImage: {
        type: String,
    },
    galleryImages: {
        type: [String],
        default: []
    },
    amenities: {
        type: [String], // Select from preset amenities
        default: []
    },
    googleMapsLink: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Stay', staySchema);
