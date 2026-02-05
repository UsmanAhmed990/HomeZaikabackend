const isAuthenticated = (req, res, next) => {
    // Passcode Bypass for Admin Portal
    if (req.headers['x-admin-passcode'] === 'admin123') {
        req.user = { id: 'guest_admin', role: 'admin', name: 'Guest Admin' };
        return next();
    }

    // Simple Header-based Auth (localStorage on Frontend sends this)
    const userId = req.headers['x-user-id'];
    if (userId) {
        req.user = { id: userId }; // Basic user identification
        return next();
    }

    return res.status(401).json({ message: 'Unauthorized. Please login.' });
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Passcode Bypass
        if (req.headers['x-admin-passcode'] === 'admin123') {
            return next();
        }

        // Simpler role check could be added if frontend sends role in headers
        next();
    };
};

module.exports = { isAuthenticated, authorizeRoles };
