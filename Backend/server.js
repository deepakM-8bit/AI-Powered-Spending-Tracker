import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import expensesRouter from "./Routers/expensesRouter.js";
import authRouter from "./Routers/authRouter.js";
import analyticsRouter from "./Routers/analyticsRouter.js";
import aiInsightsRouter from "./Routers/aiInsightsRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman
      if (allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked for origin: " + origin));
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai/insights", aiInsightsRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
