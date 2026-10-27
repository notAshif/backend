import express, { Router } from "express";
import { authController } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

router.post("/onramp", auth, authController.onramp);
router.get("/profile", auth, authController.getProfile);
router.get("/transactions", auth, authController.getTransaction);

export default router;