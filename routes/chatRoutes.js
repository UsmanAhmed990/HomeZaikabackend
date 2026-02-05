const express = require('express');
const router = express.Router();
const { sendMessage, getConversation } = require('../controllers/chatController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/send', isAuthenticated, sendMessage);
router.get('/:otherUserId', isAuthenticated, getConversation);

module.exports = router;
