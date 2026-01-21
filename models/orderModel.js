const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Resort', 'Homestay', 'Package'] // "Resort/ Homestay (Select box)" from requirements, added Package for future proofing or if implied
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    purchasePrice: { // Resort Purchase Price – B2B Price
        type: Number,
    },
    sellingPrice: { // Resort Selling Price (₹) – B2C Price
        type: Number,
    },
    status: {
        type: String,
        default: 'Confirmed', // "when an order is conformed" implied initial status
        enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Link to admin who created it if needed
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
