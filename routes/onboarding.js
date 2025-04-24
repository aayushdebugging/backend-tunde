const express = require('express');
const router = express.Router();
const supabase = require('../db');

// Middleware to check if the user is authenticated
router.use((req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// Check if onboarding is complete
router.get('/', async (req, res) => {
  try {
    const { data } = await supabase
      .from('company_onboarding')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (data) return res.redirect('/dashboard');

    res.status(200).json({ message: 'Onboarding required' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit onboarding with only email
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { error } = await supabase.from('company_onboarding').insert([{
      user_id: req.user.id,
      name: req.user.name,
      email,
    }]);

    if (error) return res.status(500).json({ error });

    res.status(201).json({ message: 'Onboarding (email only) complete. Redirect to dashboard.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
