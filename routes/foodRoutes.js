const express = require('express');
const router = express.Router();
const {
    addFood,
    updateFood,
    deleteFood,
    getAllFoods,
    getFoodDetails,
    getChefMenu
} = require('../controllers/foodController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/add', isAuthenticated, authorizeRoles('chef'), addFood);
router.put('/:id', isAuthenticated, authorizeRoles('chef'), updateFood);
router.delete('/:id', isAuthenticated, authorizeRoles('chef'), deleteFood);
router.get('/', getAllFoods);
router.get('/:id', getFoodDetails);
router.get('/chef/:chefId', getChefMenu);

module.exports = router;
