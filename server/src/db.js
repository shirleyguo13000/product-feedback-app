// Sets up a single shared connection pool to the Neon Postgres database.
// Everything else in the server imports `pool` from here rather than
// creating its own connection.
import pg from "pg";
import config from "./config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export default pool;
