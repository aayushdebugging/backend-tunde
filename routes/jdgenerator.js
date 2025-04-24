const express = require('express');
const axios = require('axios');
const supabase = require('../db/supabase'); // Adjust path based on your structure
const router = express.Router();

router.post('/generate', async (req, res) => {
  const data = req.body;

  const requiredFields = [
    "email", "role", "company", "location", "work_arrangement",
    "experience_required", "key_skills", "education", "compensation_range",
    "responsibilities", "team_structure", "perks_and_benefits", "growth_opportunities"
  ];

  const missing = requiredFields.filter(field => !data[field]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    const response = await axios.post(process.env.N8N_JD_WEBHOOK_URL, data);

    const { error: dbError } = await supabase.from('job_descriptions').insert([{
      ...data,
      created_at: new Date().toISOString()
    }]);

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      return res.status(500).json({ error: 'Failed to store JD in database' });
    }

    return res.json({
      markdownJD: response.data.markdownJD || response.data
    });

  } catch (err) {
    console.error('JD Generation Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
