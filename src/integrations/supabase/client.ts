// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://slidzkanrzycbccxibwy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsaWR6a2Fucnp5Y2JjY3hpYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMzA3OTAsImV4cCI6MjA1NTcwNjc5MH0.9Qxoc3TqDDjjV_95TPVlypxA7ncGRkLMmdGmBZfYS_s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);