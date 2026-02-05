const express = require('express');
const router = express.Router();
const { updateChefProfile, getAllChefs, getChefById } = require('../controllers/chefController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.put('/profile', isAuthenticated, authorizeRoles('chef'), updateChefProfile);
router.get('/', getAllChefs);
router.get('/:id', getChefById);

module.exports = router;
