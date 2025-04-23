-- Create users table
create table if not exists users (
  id serial primary key,
  email text unique not null,
  name text not null
);

-- Create company_onboarding table
create table if not exists company_onboarding (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  name text not null,
  email text not null,
  company_name text not null,
  company_location text not null,
  hiring_frequency text not null,
  hiring_timeline text not null,
  preferred_job_titles text[] not null,
  industry_type text not null,
  company_size integer not null,
  brand_voice text not null,
  other_preferences text,
  created_at timestamp default now()
);
