const Chef = require('../models/Chef');
const User = require('../models/User');

// Update Chef Profile
exports.updateChefProfile = async (req, res) => {
    try {
        const { bio, specialties, image } = req.body;

        let chef = await Chef.findOne({ user: req.user.id });
        if (!chef) {
            return res.status(404).json({ message: 'Chef profile not found' });
        }

        chef.bio = bio || chef.bio;
        chef.specialties = specialties || chef.specialties;
        chef.image = image || chef.image;

        await chef.save();
        res.status(200).json({ success: true, chef });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Chefs (Public)
exports.getAllChefs = async (req, res) => {
    try {
        const chefs = await Chef.find({ isApproved: true }).populate('user', 'name address');
        res.status(200).json({ success: true, chefs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Chef (Public)
exports.getChefById = async (req, res) => {
    try {
        const chef = await Chef.findById(req.params.id).populate('user', 'name address');
        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }
        res.status(200).json({ success: true, chef });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
