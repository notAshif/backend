import "dotenv/config";
import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import { authMiddleware, requireRole } from "./middleware/auth";

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRouter);

// Public: anyone can reach this route.
app.get("/courses", (req: Request, res: Response) => {
    res.json({ message: "Anyone can view courses" });
});

// Protected: the user must have a valid JWT.
app.get("/my-courses", authMiddleware, (req: Request, res: Response) => {
    res.json({ message: `Courses for ${req.user.name}` });
});

// Protected by role: only an admin can reach this route.
app.post("/admin/courses", authMiddleware, requireRole("admin"), (req: Request, res: Response) => {
    res.json({ message: "Admin course route reached" });
});

try {
    await mongoose
        .connect(process.env.MONGODB_URL!)
        .then(() => console.log("Database connected successfully"))
        .catch((error: any) => console.log(error));
    app.listen(3000, () => {
        console.log("Server Running at 3000")
    })
} catch (error: any) {
    console.log(error);
}
