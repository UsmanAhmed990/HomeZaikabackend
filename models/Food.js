const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String],
    category: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch', 'Dinner'
    dietType: { type: String, enum: ['Regular', 'Keto', 'Diabetic', 'Vegan', 'Desi'], default: 'Regular' },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
