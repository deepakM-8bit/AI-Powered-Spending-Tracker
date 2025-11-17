import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getAnalytics } from "../Controllers/analytics.js";

const router = express.Router();

router.get('/',authenticate,getAnalytics);

export default router;