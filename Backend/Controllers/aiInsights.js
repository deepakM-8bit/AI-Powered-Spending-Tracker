import OpenAI from "openai";
import pool from "../db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const userCache = new Map();

export const aiInsights = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check cache
    const cached = userCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ insights: cached.data, cached: true });
    }

    // Fetch analytics
    const cat = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses WHERE user_id=$1 GROUP BY category`,
      [userId],
    );

    const monthly = await pool.query(
      `SELECT TO_CHAR(date,'YYYY-MM') AS month, SUM(amount) AS total
       FROM expenses WHERE user_id=$1 GROUP BY month ORDER BY month`,
      [userId],
    );

    const trend = await pool.query(
      `SELECT date::date AS date, SUM(amount) AS total
       FROM expenses WHERE user_id=$1 GROUP BY date ORDER BY date`,
      [userId],
    );

    // DATA SUMMARY
    const totalSpend = cat.rows.reduce((s, c) => s + Number(c.total), 0);
    const topCategory = cat.rows.sort((a, b) => b.total - a.total)[0];
    const highestDay = trend.rows.sort((a, b) => b.total - a.total)[0];

    const firstMonth = monthly.rows[0];
    const lastMonth = monthly.rows[monthly.rows.length - 1];

    const trendDirection =
      lastMonth && firstMonth
        ? lastMonth.total > firstMonth.total
          ? "increasing"
          : "decreasing"
        : "stable";

    const summary = `
Total spend: ₹${totalSpend}
Top category: ${topCategory?.category} (₹${topCategory?.total})
Spending trend: ${trendDirection}
Highest spend day: ${highestDay?.date} (₹${highestDay?.total})
Months recorded: ${monthly.rows.length}
`;

    // CLEAN PROMPT
    const prompt = `
You are a financial insights AI. Give short bullet insights only.

DATA:
${summary}

Return structured insights:
Key Highlights, Category Breakdown, Behavior Patterns, Savings Tips, Prediction, Alerts.
`;

    // OPENAI CALL
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: "You are a financial insights assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const insights = completion.choices[0].message.content;

    // Cache
    userCache.set(userId, {
      data: insights,
      timestamp: Date.now(),
    });

    return res.json({ insights, cached: false });
  } catch (err) {
    console.error("AI Insights Error:", err);
    return res.status(500).json({ message: "AI insights error" });
  }
};
