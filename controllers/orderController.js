const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// Create New Order
// Create New Order
exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, totalAmount, customerName, customerEmail, customerPhone } = req.body;

        // Check if user is logged in and has a valid ID (not guest_admin)
        const isGuest = !req.user || req.user.id === 'guest_admin';
        const userId = (req.user && req.user.id !== 'guest_admin') ? req.user.id : null;

        const order = await Order.create({
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            isGuest,
            user: userId
        });

        // Real-time update for Admin/Chef
        const io = req.app.get('socketio');
        if (io) {
            io.emit('newOrder', order);
        }

        // Send Confirmation Email
        const itemsList = items.map(item => `<li>${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}</li>`).join('');
        const targetEmail = customerEmail;

        if (targetEmail) {
            const emailOptions = {
                email: targetEmail,
                subject: 'Order Confirmation - HOMEZaika',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #2563eb;">Hi ${customerName || 'Customer'},</h2>
                        <h3 style="color: #2563eb;">You have successfully placed an order with HOMEZaika services.</h3>
                        <p>Thank you for choosing HOMEZaika! Here are your order details:</p>
                        <div style="background: #f3f4f6; padding: 20px; border-radius: 10px;">
                            <h3>Order Summary</h3>
                            <ul>${itemsList}</ul>
                            <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
                            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                            
                            <h3>Delivery Address</h3>
                            <p>${deliveryAddress.street}, ${deliveryAddress.city}</p>
                            <p><strong>Phone:</strong> ${customerPhone || deliveryAddress.phone}</p>
                        </div>
                        <p style="margin-top: 20px;">We are preparing your homemade meal with love!</p>
                    </div>
                `
            };

            try {
                await sendEmail(emailOptions);
            } catch (emailError) {
                console.error('Email failed to send:', emailError);
            }
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('CREATE ORDER ERROR:', error);
        console.error('Stack:', error.stack);
        console.error('Body:', JSON.stringify(req.body));
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// Get My Orders (Customer)
exports.getMyOrders = async (req, res) => {
    try {
        if (!req.user || req.user.id === 'guest_admin') {
            return res.status(200).json({ success: true, orders: [] }); // Admin has no personal orders or use Admin All Orders
        }
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Chef Orders (Chef)
exports.getChefOrders = async (req, res) => {
    try {
        let chefId;

        // Handle Guest Admin logic effectively by showing ALL orders or Specific Admin Chef orders?
        // If Role is Admin, show ALL orders? or filtered? 
        // Typically Admin uses getAdminAllOrders. 
        // If Admin accesses this route, maybe return all orders or empty?
        if (req.user.role === 'admin' || req.user.id === 'guest_admin') {
            // For simplicity, if admin hits this, maybe they want to see "Admin Chef" orders or Just All?
            // Let's redirect logic to all orders OR standard Empty for now to avoid crash.
            // OR: Fetch 'Admin Chef' ID if exists.
            const Chef = require('../models/Chef');
            const adminChef = await Chef.findOne({ businessName: 'Home Zaika Admin' });
            if (adminChef) {
                chefId = adminChef._id;
            } else {
                // If no admin chef profile, return empty
                return res.status(200).json({ success: true, orders: [] });
            }
        } else {
            const Chef = require('../models/Chef');
            const chef = await Chef.findOne({ user: req.user.id });
            if (!chef) return res.status(404).json({ message: 'Chef not found' });
            chefId = chef._id;
        }

        const orders = await Order.find({ chef: chefId }).populate('user', 'name').sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order Status (Chef/Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get All Orders (Admin)
exports.getAdminAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
