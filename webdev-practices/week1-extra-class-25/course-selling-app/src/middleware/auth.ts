import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../model/user";

interface AuthenticatedRequest extends Request {
    user: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : " ";

    if (!token) {
        return res.status(401).json({ error: "Token required" });
    }

    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] });

        if (typeof payload != "object" || !payload.sub) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await User.findById(payload.sub);

        if (!user) {
            return res.status(409).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error: any) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

export const requireRole = (role: any) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    }
}
