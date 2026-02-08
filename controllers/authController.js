const User = require('../models/User');
const Chef = require('../models/Chef');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// ================= REGISTER (SIGNUP ONLY) =================
exports.registerUser = async (req, res) => {
    try {
        const { name, email, role, address } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already registered' });
        }

        const user = await User.create({
            name,
            email,
            role: role || 'customer',
            address
        });

        if (role === 'chef') {
            await Chef.create({ user: user._id });
        }

        // Send Notification Email (Non-blocking)
        sendEmail({
            email: user.email,
            subject: 'Welcome to HomeZaika!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                    <h2 style="color: #2563eb;">Welcome to HomeZaika, ${user.name}!</h2>
                    <p>You have successfully registered to HomeZaika. Thanks for using our services.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666;">Start exploring fresh homemade food now!</p>
                </div>
            `
        }).catch(err => console.error('Background Email Error:', err));

        res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('REGISTRATION ERROR:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// LOGIN USER (Email Only for now as per Signup System)
exports.loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please enter your email' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or user not found' });
        }

        // Since we are passwordless for now, just log them in
        // In a real app, send OTP or Magic Link here. 
        // For this task, we treat email match as authentication.

        // Send confirmation/login email (optional)

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.logoutUser = (req, res) => {
    // Frontend handles token removal
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ================= ADMIN: ALL USERS =================
exports.getAdminAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('ADMIN ALL USERS ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
