import { createClient } from "@supabase/supabase-js";

// Supabase client setup for Supabase API interactions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and API key are required.");
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
