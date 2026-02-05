const Food = require('../models/Food');
const Chef = require('../models/Chef');

// Add Food Item
// Add Food Item
exports.addFood = async (req, res) => {
    try {
        let chefId;

        // Handle Guest Admin Case
        if (req.user.id === 'guest_admin' || req.user.role === 'admin') {
            // Find or create a system chef profile for admin
            // We need a valid ObjectId for the 'chef' field in Food model
            // Let's try to find a chef profile with a placeholder user ID (or skip user lookup)
            // Ideally, we should have a real Admin User in DB. 
            // Workaround: Find ANY chef to assign or create a dummy one.

            // Since we can't query Chef by 'guest_admin' (string), let's find a chef by name "Admin Chef"
            let adminChef = await Chef.findOne({ businessName: 'Home Zaika Admin' });

            if (!adminChef) {
                // Create a dummy chef for admin operations
                // We need a valid ObjectId for 'user' too if Chef schema requires it.
                // Chef schema: user: ObjectId ref User.
                // We might need to create a dummy User first?
                // Or just cast a dummy valid ObjectId if we can?
                // Let's create a placeholder chef linked to the first user found or a specific admin user if exists.

                // Hack: Use an arbitrary valid ObjectId for user if we don't have a real admin user.
                // MongoDB ObjectIds are 24 hex chars. 
                const dummyUserId = "000000000000000000000000";

                adminChef = await Chef.create({
                    user: dummyUserId, // This might fail if User requires existence check, but typically Ref doesn't enforce FK constraint strictly in Mongoose unless populated
                    businessName: "Home Zaika Admin",
                    specialty: "General",
                    isApproved: true
                });
            }
            chefId = adminChef._id;

        } else {
            const chef = await Chef.findOne({ user: req.user.id });
            if (!chef) {
                return res.status(404).json({ message: 'Chef profile not found' });
            }
            chefId = chef._id;
        }

        const food = await Food.create({
            ...req.body,
            chef: chefId
        });

        res.status(201).json({ success: true, food });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Food Item
exports.updateFood = async (req, res) => {
    try {
        let food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Allow Admin to bypass ownership check
        if (req.user.id !== 'guest_admin' && req.user.role !== 'admin') {
            const chef = await Chef.findOne({ user: req.user.id });
            if (!chef || food.chef.toString() !== chef._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this food' });
            }
        }

        food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, food });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Food Item
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Allow Admin to bypass ownership check
        if (req.user.id !== 'guest_admin' && req.user.role !== 'admin') {
            const chef = await Chef.findOne({ user: req.user.id });
            if (!chef || food.chef.toString() !== chef._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this food' });
            }
        }

        await food.deleteOne();
        res.status(200).json({ success: true, message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Foods (with filters)
exports.getAllFoods = async (req, res) => {
    try {
        const { keyword, category, dietType } = req.query;
        let query = { available: true };

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (dietType) {
            query.dietType = dietType;
        }

        const foods = await Food.find(query).populate('chef');
        res.status(200).json({ success: true, foods });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Food
exports.getFoodDetails = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('chef');
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json({ success: true, food });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Chef's Menu (Public)
exports.getChefMenu = async (req, res) => {
    try {
        const foods = await Food.find({ chef: req.params.chefId, available: true });
        res.status(200).json({ success: true, foods });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
