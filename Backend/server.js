import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import expensesRouter from './Routers/expensesRouter.js';
import authRouter from './Routers/authRouter.js';
import analyticsRouter from './Routers/analyticsRouter.js'

dotenv.config();

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/auth",authRouter);
app.use("/api/expenses",expensesRouter);
app.use("/api/analytics",analyticsRouter);

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});