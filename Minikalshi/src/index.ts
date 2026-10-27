import "dotenv/config";
import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import marketRouter from "./routes/marketRoutes";
import resolveRouter from "./routes/resolveRoutes";


const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "hi there" });
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/market", marketRouter);
app.use("/api/v1/resolve", resolveRouter);


try {
  await mongoose
    .connect(process.env.DATABASE_URL!)
    .then(() => console.log("Database connected successfully!!"))
    .catch(() => console.log("failed to connect database."));
  app.listen(3000, () => console.log("Server running at port 3000."));
} catch (err: any) {
  console.log("failed to connect db.");
}
