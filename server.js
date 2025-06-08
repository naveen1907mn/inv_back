const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://inv-front-azri.onrender.com',  // Your frontend URL
  'http://localhost:3000'                 // Local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Log CORS errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.error('CORS Error:', {
      origin: req.headers.origin,
      method: req.method,
      path: req.path
    });
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Not allowed by CORS policy',
      origin: req.headers.origin
    });
  }
  next(err);
});

app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Inventory Management API',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

// API routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: {
      allowedOrigins
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 API Documentation available at http://localhost:${PORT}`);
  console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
});
