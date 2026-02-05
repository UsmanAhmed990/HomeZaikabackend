const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: ['customer', 'admin', 'chef'], default: 'customer' },
    address: {
        street: String,
        city: String,
        zip: String
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
