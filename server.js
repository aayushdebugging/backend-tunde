require('dotenv').config(); // Load environment variables

const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth/googleAuth'); // Google OAuth configuration

// Import routes
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const jdRoutes = require('./routes/jdgenerator'); // NEW: JD generation route

const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Register route modules
app.use('/auth', authRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/jd', jdRoutes); // NEW: Add JD generation route

// Protected dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/auth/google');
  res.send(`<h1>Welcome ${req.user.name} to your dashboard!</h1>`);
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
