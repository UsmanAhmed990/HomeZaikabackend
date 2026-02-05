const Message = require('../models/Message');

// Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content
        });
        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Conversation
exports.getConversation = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
