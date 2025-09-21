import { Router } from "express";
import { getGuestInfo } from "../controllers/guest.controller.js";

const router = Router();

// Guest routes - no authentication required
router.route("/info").get(getGuestInfo);

export default router;
