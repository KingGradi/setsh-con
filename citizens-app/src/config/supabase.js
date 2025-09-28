import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Fallback values for development
const supabaseUrl = SUPABASE_URL || 'https://qlxwzpnslabmckzogqit.supabase.co';
const supabaseAnonKey = SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseHd6cG5zbGFibWNrem9ncWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDI5MzAsImV4cCI6MjA3NDI3ODkzMH0.IXiess17sPAh9XA6rcV6yijUNxyySLIS4hisJTMbTCg';

console.log('Supabase URL (from env):', SUPABASE_URL);
console.log('Supabase ANON Key (from env):', SUPABASE_ANON_KEY);
console.log('Supabase URL (final):', supabaseUrl);
console.log('Supabase ANON Key (final):', supabaseAnonKey ? 'Set (length: ' + supabaseAnonKey.length + ')' : 'Not set');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables not set!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
