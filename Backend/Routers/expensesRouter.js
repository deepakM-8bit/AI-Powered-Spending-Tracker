import express from 'express';
import { addExpenses, deleteExpenses, getExpenses, updateExpenses } from '../Controllers/expensesControllers.js';

const router = express.Router();

router.get("/", getExpenses);
router.post("/",addExpenses);
router.put("/:id",updateExpenses);
router.delete("/:id",deleteExpenses);

export default router;