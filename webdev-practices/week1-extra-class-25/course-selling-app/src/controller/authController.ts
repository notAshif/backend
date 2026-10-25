import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../schema/schema";
import { User } from "../model/user";
import jwt from "jsonwebtoken"
import "dotenv/config"

const authController = {
    async signup(req: Request, res: Response) {
        const parsed = signupSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid signup details" });
        }

        const { name, email, password } = parsed.data;

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(409).json({ error: "Email already registered" });
            }

            const passwordHash = await Bun.password.hash(password)

            const user = await User.create({
                name,
                email,
                passwordHash,
                role: "student",
            })

            return res.status(201).json({
                message: "Account created",
                userId: user.id
            })

        } catch (error: any) {
            if (error.code === 110219) {
                return res.status(401).json({
                    error: "Email already registered",
                });
            }
            return res.status(500).json({
                error: "Could not create account",
            });
        }
    },

    async signin(req: Request, res: Response) {
        const parsed = signinSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid signup details" });
        }

        const { email, password } = parsed.data;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(409).json({ error: "Invalid email or password" });
            }

            const passwordMatch = await Bun.password.verify(password, user.passwordHash);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {expiresIn: "2h", algorithm: "HS256"});

            return res.json({ token });
        } catch (error: any) {
            return res.status(500).json({
                error: "Could not sign in",
            });
        }
    }
};

export default authController;
