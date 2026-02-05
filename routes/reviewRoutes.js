const express = require('express');
const router = express.Router();
const { addRating, addReview } = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/ratings', isAuthenticated, addRating);
router.post('/reviews', isAuthenticated, addReview);

module.exports = router;
