require("dotenv").config({ override: true });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  const usersQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;

  const workspacesQuery = `
    CREATE TABLE IF NOT EXISTS workspaces (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  const tasksQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE
    )
  `;

  await pool.query(usersQuery);
  await pool.query(workspacesQuery);
  await pool.query(tasksQuery);
}

module.exports = { pool, createTables };