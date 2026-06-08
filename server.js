require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const ApiError = require('./utils/apiError');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Global Middlewares
// Use custom helmet settings to allow loading external resources (videos, images, fonts) on the frontend
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        "font-src": ["'self'", "fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "blob:", "images.higgs.ai", "*.googleusercontent.com", "lh3.googleusercontent.com"],
        "media-src": ["'self'", "d8j0ntlcm91z4.cloudfront.net"],
        "connect-src": ["'self'"],
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Mount API Routes
app.use('/api/expenses', expenseRoutes);

// Fallback for non-existent API routes
app.use('/api/*splat', (req, res, next) => {
  next(new ApiError(404, `API route not found: ${req.originalUrl}`));
});

// For any non-API route, send index.html (supports SPA styling if needed, or serves Dashboard directly)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler Middleware
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
let server;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`\x1b[36m[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}\x1b[0m`);
  });
}

// Handle unhandled promise rejections outside Express
process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31m[Unhandled Rejection] Shutting down: ${err.message}\x1b[0m`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

module.exports = app;
