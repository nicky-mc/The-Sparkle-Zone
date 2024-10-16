import { createClient } from "@supabase/supabase-js";
import pg from "pg";

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD;
export const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL connection setup
const dbConnectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db = new pg.Pool({
  connectionString: dbConnectionString,
});

export { db };
