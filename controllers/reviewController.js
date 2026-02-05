const Review = require('../models/Review');
const Food = require('../models/Food');

// Add Rating
exports.addRating = async (req, res) => {
    try {
        const { foodId, rating } = req.body;
        // Search if user already rated
        let review = await Review.findOne({ user: req.user.id, food: foodId });
        if (review) {
            review.rating = rating;
            await review.save();
        } else {
            review = await Review.create({
                user: req.user.id,
                food: foodId,
                rating
            });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Review (Remarks)
exports.addReview = async (req, res) => {
    try {
        const { foodId, review: comment } = req.body;
        let review = await Review.findOne({ user: req.user.id, food: foodId });
        if (review) {
            review.comment = comment;
            await review.save();
        } else {
            // Default rating 5 if not provided yet? User usually clicks stars first.
            review = await Review.create({
                user: req.user.id,
                food: foodId,
                rating: 5,
                comment
            });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
