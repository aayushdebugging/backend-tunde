require('dotenv').config();
const fetch = require('node-fetch');

const createTablesSQL = `
  -- Enable UUID generation (only needed if using UUIDs)
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create users table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
  );

  -- Create company_onboarding table
  CREATE TABLE IF NOT EXISTS company_onboarding (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_location TEXT NOT NULL,
    hiring_frequency TEXT NOT NULL,
    hiring_timeline TEXT NOT NULL,
    preferred_job_titles TEXT[] NOT NULL,
    industry_type TEXT NOT NULL,
    company_size INTEGER NOT NULL,
    brand_voice TEXT NOT NULL,
    other_preferences TEXT,
    created_at TIMESTAMP DEFAULT now()
  );

  -- Create job_descriptions table
  CREATE TABLE IF NOT EXISTS job_descriptions (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    work_arrangement TEXT NOT NULL,
    experience_required TEXT NOT NULL,
    key_skills TEXT[] NOT NULL,
    education TEXT NOT NULL,
    compensation_range TEXT NOT NULL,
    responsibilities TEXT,
    team_structure TEXT,
    perks_and_benefits TEXT,
    growth_opportunities TEXT,
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
