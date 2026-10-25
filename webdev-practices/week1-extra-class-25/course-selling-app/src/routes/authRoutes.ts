import { Router, type Request, type Response } from "express"
import authController from "../controller/authController";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

export default router;