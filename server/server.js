require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const linksRoutes = require('./src/routes/linksRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const cors = require('cors');
const app = express();

const allowedOrigins = process.env.CLIENT_ENDPOINT?.split(',') || [];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log(error));

// Standard middleware for all routes
app.use(express.json());
app.use(cookieParser());

// Register routes
app.use('/auth', authRoutes);
app.use('/links', linksRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);

const PORT = 5001;
app.listen(PORT, (error) => {
    if (error) {
        console.log('Error starting the server: ', error);
    } else {
        console.log('Server is running at http://localhost:${PORT}');
    }
});