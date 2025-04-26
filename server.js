import 'dotenv/config'; // .env loader

import express from 'express';
import session from 'express-session';
import passport from 'passport';

import './auth/googleAuth.js'; // Initialize Google auth

// Routes
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';
import jdRoutes from './routes/jdgenerator.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/jd', jdRoutes);

app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/auth/google');
  res.send(`<h1>Welcome ${req.user.name} to your dashboard!</h1>`);
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
