const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/onboarding');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;
