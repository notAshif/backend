import { Router } from "express";
import { auth } from "../middleware/auth";
import { requireAdminOrOracle } from "../middleware/admin";
import { resolveController } from "../controllers/resolveController";

const router = Router();

router.post("/", auth, requireAdminOrOracle, resolveController.resolve);

export default router;
