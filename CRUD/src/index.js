const express = require("express");
const { pool, createTables } = require("./db");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const auth = require("./middleware/auth");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());

// Routes
// Mounted at "/" so router.post("/signup") becomes POST /signup.
// (If you mounted at "/auth", it would become POST /auth/signup.)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", workspaceRoutes);
app.use("/api/v1/", taskRoutes);


async function startServer() {
  try {
    // 1. Check DB connection
    await pool.query("SELECT 1");
    console.log("database connected");

    // 2. Create tables
    await createTables();
    console.log("tables ready");

    // 3. Start server
    app.listen(3000, () => {
      console.log("server running at 3000");
    });
  } catch (err) {
    console.error("failed to start server", err);
    process.exit(1);
  }
}

startServer();
