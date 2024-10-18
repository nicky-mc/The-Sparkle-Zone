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

// Initialize Supabase client for image uploads and other services
export const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL connection setup (for custom SQL queries)
const dbConnectionString = process.env.SUPABASE_DB_CONNECTION_URL; // Your PostgreSQL connection string
const db = new pg.Pool({
  connectionString: dbConnectionString,
});

export { db };

/**
 * Uploads image to Supabase storage bucket
 * @param {File} file - The file to be uploaded
 * @returns {String} - Public URL of the uploaded image
 */
export const uploadImage = async (file) => {
  try {
    const fileName = `${Date.now()}_${file.name}`; // Generate unique file name
    const { data, error } = await supabase.storage
      .from("images") // Your Supabase bucket name
      .upload(fileName, file);

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }

    const { publicURL } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);
    return publicURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

/**
 * Query function to execute SQL queries on the PostgreSQL database
 * @param {String} query - SQL query to be executed
 * @param {Array} params - Optional query parameters
 * @returns {Object} - Result of the query
 */
export const queryDb = async (query, params = []) => {
  try {
    const client = await db.connect();
    const result = await client.query(query, params);
    client.release();
    return result;
  } catch (error) {
    console.error("Error executing query", error.stack);
    throw new Error(`Database query failed: ${error.message}`);
  }
};
