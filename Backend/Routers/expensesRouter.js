import express from 'express';
import { authenticate } from "../middleware/authMiddleware.js";
import { addExpenses, deleteExpenses, getExpenses, updateExpenses } from '../Controllers/expensesControllers.js';

const router = express.Router();

router.get("/", authenticate, getExpenses);
router.post("/", authenticate, addExpenses);
router.put("/:id", authenticate, updateExpenses);
router.delete("/:id", authenticate, deleteExpenses);

export default router;