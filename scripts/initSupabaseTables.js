require('dotenv').config();
const fetch = require('node-fetch');

const createTablesSQL = `
  -- Enable UUID generation
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
  );

  -- Create company_onboarding table (for now only requires email)
  CREATE TABLE IF NOT EXISTS company_onboarding (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Updated job_descriptions table with new required fields
  CREATE TABLE IF NOT EXISTS job_descriptions (
    id SERIAL PRIMARY KEY,
    recruiter_email TEXT NOT NULL,
    recruiter_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    skills_required TEXT[] NOT NULL,
    experience_required_years INTEGER NOT NULL,
    position_level TEXT NOT NULL,
    work_mode TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_range_lpa TEXT NOT NULL,
    notice_period_days INTEGER NOT NULL,
    qualification TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL,
    team_structure TEXT NOT NULL,
    perks_and_benefits TEXT NOT NULL,
    growth_opportunities TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );
`;

(async () => {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: createTablesSQL })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    console.log('✅ All tables created successfully in Supabase!');
  } catch (err) {
    console.error('❌ Failed to initialize tables:', err.message);
  }
})();
