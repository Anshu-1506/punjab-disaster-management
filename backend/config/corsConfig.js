/**
 * CORS Configuration for Punjab Ready Portal
 * Configures Cross-Origin Resource Sharing settings
 */

import cors from 'cors';

// Allowed origins
// In your allowedOrigins array, ADD your actual Vercel domain:
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://punjab-disaster-management-f9dx.vercel.app', // ADD YOUR ACTUAL DOMAIN
  'https://punjab-disaster-m-git-7e1352-anshuman-tiwaris-projects-8ff7be62.vercel.app', // ADD THIS TOO
  'https://*.vercel.app' // Wildcard for all Vercel deployments
];
// CORS options configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log unauthorized origins
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
    'X-API-Key'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Access-Control-Expose-Headers'
  ],
  maxAge: 86400, // 24 hours in seconds
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Development CORS configuration (more permissive)
const devCorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Production CORS configuration (strict)
const prodCorsOptions = {
  origin: (origin, callback) => {
    // In production, only allow specific domains
    const productionDomains = [
      'https://punjab-ready-portal.gov.in',
      'https://www.punjab-ready-portal.gov.in',
      'https://punjab-ready-portal.vercel.app'
    ];
    
    if (!origin || productionDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked production request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204
};

// Get appropriate CORS configuration based on environment
const getCorsConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  switch (environment) {
    case 'production':
      return cors(prodCorsOptions);
    case 'development':
      return cors(devCorsOptions);
    case 'testing':
      return cors({ origin: false }); // No CORS in testing
    default:
      return cors(corsOptions);
  }
};

// Middleware to handle CORS errors gracefully
const corsErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation: Access denied',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  next();
};

// Utility function to add CORS headers manually (if needed)
const addCorsHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
};

export {
  corsOptions,
  devCorsOptions,
  prodCorsOptions,
  getCorsConfig,
  corsErrorHandler,
  addCorsHeaders,
  allowedOrigins
};

export default getCorsConfig;