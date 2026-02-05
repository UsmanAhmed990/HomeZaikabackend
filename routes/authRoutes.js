const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, getAdminAllUsers } = require('../controllers/authController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticated, getUserProfile);
router.get('/admin/all', isAuthenticated, authorizeRoles('admin'), getAdminAllUsers);

module.exports = router;
