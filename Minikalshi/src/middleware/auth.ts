import "dotenv/config";
import { type NextFunction, type Request, type Response } from "express"
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized." });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!, {
            algorithms: ["HS512"]
        })

        if (!payload) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const user = await User.findById(payload.sub);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.userId = user.id;
        next();
    } catch (err: any) {
        console.log(err)
        return res.status(500).json({message: "Internal server error."})
    }
}