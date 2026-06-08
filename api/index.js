// Vercel Serverless Function Entry Point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('../config/db');
const expenseRoutes = require('../routes/expenseRoutes');
const errorHandler = require('../middleware/errorMiddleware');
const ApiError = require('../utils/apiError');

const app = express();

// Security & CORS
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for API — frontend is served separately by Vercel CDN
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure MongoDB is connected before EVERY request (critical for serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(new ApiError(503, 'Database connection failed. Please try again.'));
  }
});

// API Routes
app.use('/api/expenses', expenseRoutes);

// 404 for unknown API routes
app.use('/api/*splat', (req, res, next) => {
  next(new ApiError(404, `API route not found: ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
