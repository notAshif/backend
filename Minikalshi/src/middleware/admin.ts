import { type NextFunction, type Request, type Response } from "express";

export const requireAdminOrOracle = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== "admin" && req.userRole !== "oracle") {
        return res.status(403).json({
            error: "Forbidden: Only an admin or oracle can perform this action."
        });
    }
    next();
};
