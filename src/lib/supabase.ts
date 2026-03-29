import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ktetlxuftfkjwbdwzdwy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXRseHVmdGZrandiZHd6ZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTMwMTgsImV4cCI6MjA4OTg4OTAxOH0.xMiqwHw0UQ8l9lAWnYTSyRrgqapBBvZyQkzrKQ8mnQA';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
