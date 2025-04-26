import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import supabase from '../db.js'; // Note the `.js` extension

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) {
    return done(error);
  }
  done(null, data);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;

  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    return done(error);
  }

  if (!user) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name }])
      .select()
      .single();

    if (error) return done(error);
    user = data;
  }

  done(null, user);
}));
