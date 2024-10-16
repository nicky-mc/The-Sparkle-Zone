import pg from "pg";

// This function connects to the database using the connection string and returns the connection
function connect() {
  const dbConnectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const db = new pg.Pool({
    connectionString: dbConnectionString,
  });
  return db;
}

// This exports the db connection to be used in other files
export const db = connect();
