# Backend Overview: Google OAuth, Onboarding, and Supabase Integration

This project handles user authentication using Google OAuth and onboarding via a form submission. Supabase is used to store user and onboarding data.

## Flow Overview

1. **Google Authentication**: 
   - User logs in via Google OAuth. 
   - Passport.js handles Google OAuth authentication, storing the user’s Google profile in the session.
   - User data (email, name) is stored in the Supabase `users` table if it doesn't already exist.

2. **Onboarding Process**: 
   - If it's the user's first login, they are redirected to an onboarding form.
   - The onboarding form collects company-related data.
   - This data is stored in the `company_onboarding` table in Supabase.

3. **Dashboard**: 
   - Once onboarding is complete, the user is redirected to their dashboard.

## Technologies Used

- **Passport.js** for Google OAuth authentication
- **Supabase** for PostgreSQL database
- **Express.js** for backend server and routing
- **Express-session** for session management

## Directory Structure

