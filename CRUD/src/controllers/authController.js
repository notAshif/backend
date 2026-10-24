require("dotenv").config();
const { signUpSchema, signInSchema } = require("../types/types");
const { pool } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authController = {
  async signUp(req, res) {
    try {
      // 1. Validate input
      const { data, success, error } = signUpSchema.safeParse(req.body);

      if (!success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: error.issues,
        });
      }

      const { username, password } = data;

      // 2. Check if user already exists
      const existing = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      // 3. Insert user
      const hashPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, hashPassword],
      );

      // 4. Respond
      return res.status(201).json({ message: "User created" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async signIn(req, res) {
    try {
      const { data, success, error } = signInSchema.safeParse(req.body);

      if (!success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: error.issues,
        });
      }

      const { username, password } = data;

      const existing = await pool.query(
        "SELECT id, username, password FROM users WHERE username = $1",
        [username],
      );

      const user = existing.rows[0];

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const matchedPassword = await bcrypt.compare(password, user.password);

      if (matchedPassword) {
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || "ghbfjhgfjdsgfjhgfjhdsgf",
        );
        
        return res.status(200).json({ token });
      }

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
