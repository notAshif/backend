import "dotenv/config";
import type { Request, Response } from "express";
import { onrampSchema, signinSchema, signupSchema } from "../types/auth";
import { User } from "../models/user";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import { WalletEvent } from "../models/walletEvent";

export const authController = {

    async signup(req: Request, res: Response) {
        try {
            const parsed = signupSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid Format." });
            }

            const { username, password } = parsed.data;

            const existingUser = await User.findOne({ username });

            if (existingUser) {
                return res.status(409).json({ message: "User already exist." });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({
                username,
                password: passwordHash,
            })

            return res.status(200).json({
                id: user._id,
            });

        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    async signin(req: Request, res: Response) {
        try {
            const parsed = signinSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid Format." });
            }

            const { username, password } = parsed.data;

            const user = await User.findOne({ username });

            if (!user) {
                return res.status(409).json({ message: "User not found." });
            }

            const validPass = await bcrypt.compare(password, user.password);

            if (!validPass) {
                return res.status(401).json({
                    message: "Invalid username or password."
                });
            }

            const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET!, {
                expiresIn: "1d",
                algorithm: "HS512"
            });
            
            return res.status(200).json({
                token: token
            });

        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },


    async onramp(req: Request, res: Response) {
        try {

            const parsed = onrampSchema.safeParse(req.body);

            if (!parsed.success) {
                return res.status(401).json({ message: "Invalid Format." });
            }

            const { amount } = parsed.data;

            const user = await User.findByIdAndUpdate(req.userId, 
                {$inc: { balance: amount }},
                { returnDocument: 'after' },
            )

            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            await WalletEvent.create({
                userId: req.userId,
                tx_type: "onramp",
                amount
            })

            return res.status(200).json({
                balance: user.balance,
            })
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            })
        }
    },

    async getProfile(req: Request, res: Response) {
        try {
            const user = await User.findById(req.userId).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            return res.status(200).json(user);
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            })
        }
    },

    async getTransaction(req: Request, res: Response) {
        try {

            const transaction = await WalletEvent.find({
                userId: req.userId
            });

            if (!transaction) {
                return res.status(404).json({
                    message: "Transaction not found."
                });
            }

            return res.status(200).json(transaction);
            
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error."
            });
        }
    }
}