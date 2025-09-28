import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock users for testing
const mockUsers = [
  {
    id: 1,
    email: 'rajesh.kumar@gov.punjab.in',
    password: 'punjab123',
    name: 'Dr. Rajesh Kumar',
    role: 'disaster_management_officer'
  },
  {
    id: 2,
    email: 'priya.singh@gov.punjab.in',
    password: 'punjab123', 
    name: 'Ms. Priya Singh',
    role: 'education_coordinator'
  },
  {
    id: 3,
    email: 'hardeep.singh@gov.punjab.in',
    password: 'punjab123',
    name: 'Mr. Hardeep Singh',
    role: 'system_admin'
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Find user
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please contact your system administrator.'
      });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret-for-vercel',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!'
  });
});

export default router;