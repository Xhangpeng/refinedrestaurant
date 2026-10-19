import { createClient } from '@supabase/supabase-js';

// Supabase credentials can be supplied via environment variables
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'https://placeholder-project.supabase.co' && !url.includes('placeholder'));
};

/**
 * Standard Supabase client instance
 * Ready for authentication, database CRUD queries, and real-time subscriptions
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
