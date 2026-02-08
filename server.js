require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.set('socketio', io);
const PORT = process.env.PORT || 5020;

// Socket.io configuration
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', ({ senderId, receiverId, content }) => {
        io.to(receiverId).emit('message', { senderId, content, createdAt: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true, // Allow all origins dynamically
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(cookieParser());


// Routes
const authRoutes = require('./routes/authRoutes');
const chefRoutes = require('./routes/chefRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/chef', chefRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', reviewRoutes); // Ratings/Reviews endpoints

app.get('/', (req, res) => {
    res.send('Home Ziaka Backend Running');
});

// Database Connection with Retry Logic
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeziaka', {
            serverSelectionTimeoutMS: 5020,
            socketTimeoutMS: 45020,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);

        // Help user with specific whitelisting instructions
        console.log('\n---------------------------------------------------------');
        console.log('🛑 DATABASE ACCESS DENIED');
        console.log('To fix this, go to MongoDB Atlas -> Network Access and add:');
        console.log('👉 IP Address: 103.47.181.41');
        console.log('OR add 0.0.0.0/0 to allow access from anywhere.');
        console.log('---------------------------------------------------------\n');

        // Retry connection after 5 seconds
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5020);
    }
};

connectDB();


// Export for Vercel (Serverless)
module.exports = app;

// Only listen if run directly (Local Development)
if (require.main === module) {
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

