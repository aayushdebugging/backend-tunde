require('dotenv').config();  // Load environment variables
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth/googleAuth');  // Import Google OAuth setup

// Import routes
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/auth', authRoutes);
app.use('/onboarding', onboardingRoutes);

// Dashboard route to test if user is logged in
app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/auth/google');
  res.send(`<h1>Welcome ${req.user.name} to your dashboard!</h1>`);
});

// Start the server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
