import pg from pg;
//this is to connect to the database using the connection string and return the connection
function connect() {
    const dbConnectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const db = new pg.pool({
        connectionString: dbConnectionString,
    });
    return db;
}
//this is to export the db connection to be used in other files
export const db = connect();