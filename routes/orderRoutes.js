const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getChefOrders, updateOrderStatus } = require('../controllers/orderController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');






router.post('/new', createOrder);
router.get('/me', isAuthenticated, getMyOrders);
router.get('/chef', isAuthenticated, authorizeRoles('chef'), getChefOrders);
router.get('/admin/all', isAuthenticated, authorizeRoles('admin'), require('../controllers/orderController').getAdminAllOrders);
router.put('/:id', isAuthenticated, authorizeRoles('chef', 'admin'), updateOrderStatus);

module.exports = router;
