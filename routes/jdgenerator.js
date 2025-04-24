const express = require('express');
const axios = require('axios');
const supabase = require('../db/supabase'); // Adjust path as needed
const router = express.Router();

// List of all required top-level keys in the structured schema
const requiredFields = [
  "recruiter_email", "job_title", "recruiter_name", "company_name",
  "skills_required", "experience_required_years", "position_level", "work_mode",
  "location", "salary_range_lpa", "notice_period_days", "qualification",
  "responsibilities", "team_structure", "perks_and_benefits", "growth_opportunities"
];

router.post('/generate', async (req, res) => {
  const data = req.body;

  // Check for missing or empty values in the new schema structure
  const missingFields = requiredFields.filter(field => {
    const value = data[field]?.value;
    return value === undefined || value === null || value === "" || 
      (Array.isArray(value) && value.length === 0);
  });

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing or empty fields: ${missingFields.join(', ')}` });
  }

  try {
    // Flatten the schema to plain key-value for the API and DB
    const flattenedData = {};
    for (const field of requiredFields) {
      flattenedData[field] = data[field].value;
    }
    flattenedData.created_at = new Date().toISOString();

    // Call external webhook to generate JD
    const response = await axios.post(process.env.N8N_JD_WEBHOOK_URL, flattenedData);

    // Store in Supabase
    const { error: dbError } = await supabase.from('job_descriptions').insert([flattenedData]);

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
