import { createClient } from "@supabase/supabase-js";
import pg from "pg";

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PASSWORD;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

if (!supabaseUrl) {
  throw new Error("supabaseUrl is required.");
}

if (!supabaseKey) {
  throw new Error("supabaseKey is required.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL connection setup
const dbConnectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db = new pg.Pool({
  connectionString: dbConnectionString,
});

export { db };
