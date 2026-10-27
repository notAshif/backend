import { Router } from "express";
import { marketController } from "../controllers/marketController";
import { auth } from "../middleware/auth";
import { resolveController } from "../controllers/resolveController";

const router = Router();

router.post("/", auth, resolveController.resolve);

export default router;