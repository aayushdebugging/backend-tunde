const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with environment variables for URL and API key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
