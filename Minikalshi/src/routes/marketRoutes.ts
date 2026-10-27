import { Router } from "express";
import { marketController } from "../controllers/marketController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, marketController.create);
router.get("/", marketController.getMarkets);

router.post("/bet", auth, marketController.placesBet);
router.get("/bets", auth, marketController.getMarkets);

export default router;