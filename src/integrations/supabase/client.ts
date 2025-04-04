
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pfqckmqntaberntfxfph.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcWNrbXFudGFiZXJudGZ4ZnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2Mzc4MTUsImV4cCI6MjA1OTIxMzgxNX0.RqUevE4tVj7P1S0SI6aA2uYa65JeLBRlPvL2mnP62vY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
