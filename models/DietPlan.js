const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "7-Day Keto Plan"
    description: String,
    type: { type: String, enum: ['Weight Loss', 'Diabetic', 'Keto', 'Desi'], required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }, // Optional, if linked to a chef
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }], // Associated foods
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
