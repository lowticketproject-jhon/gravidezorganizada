import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktetlxuftfkjwbdwzdwy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXRseHVmdGZrandiZHd6ZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTMwMTgsImV4cCI6MjA4OTg4OTAxOH0.xMiqwHw0UQ8l9lAWnYTSyRrgqapBBvZyQkzrKQ8mnQA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
