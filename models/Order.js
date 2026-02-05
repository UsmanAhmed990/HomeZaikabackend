const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    isGuest: { type: Boolean, default: false },
    items: [{
        food: { type: String },
        name: { type: String }, // Storing name for history
        quantity: { type: Number, default: 1 },
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    deliveryAddress: {
        street: String,
        city: String,
        zip: String
    },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }, // If order is specific to one chef/restaurant context
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
