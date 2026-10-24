require("dotenv").config({ override: true });
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

async function auth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Unauthorized" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await pool.query(
      `SELECT id, username FROM users WHERE id=$1`,
      [decode.userId]
    )

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    req.userId = user.rows[0].id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Invalid token" });
  }
}

module.exports = auth;
