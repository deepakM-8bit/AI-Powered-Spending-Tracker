import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { getAnalytics } from "../Controllers/analytics";

const router = express.Router();

router.get('/',authenticate,getAnalytics);

export default router;