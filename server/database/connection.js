require("dotenv").config();
const { Pool } = require("pg");

// Create a new pool instance for connection pooling
const pool = new Pool({
    user: process.env.PG_USER, // PostgreSQL username
    host: process.env.PG_HOST, // Database host (use the correct IP if remote)
    database: process.env.PG_DATABASE, // PostgreSQL database name
    password: process.env.PG_PASSWORD, // PostgreSQL user password
    port: process.env.PG_PORT, // PostgreSQL port (default is 5432)
});

module.exports = pool;
