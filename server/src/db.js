// Sets up a single shared connection pool to the Neon Postgres database.
// Everything else in the server imports `db` from here rather than
// creating its own connection.
//
// DATABASE_URL is read from the environment (not a committed file):
// locally it comes from server/.env (gitignored, loaded by dotenv/config
// in index.js); on Render it's set directly in the service's Environment
// settings.
import pg from "pg";

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // use SSL encryption when connecting to the database
});

export default db;
