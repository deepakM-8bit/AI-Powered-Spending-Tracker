import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../db.js";

const models = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

const getStatus = (err) =>
  err?.status || err?.statusCode || err?.response?.status || null;

export const aiInsights = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch analytics data
    const cat = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY category`,
      [userId]
    );

    const monthly = await pool.query(
      `SELECT TO_CHAR("date", 'YYYY-MM') AS month,
       SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY month
       ORDER BY month ASC`,
      [userId]
    );

    const trend = await pool.query(
      `SELECT "date"::date AS date,
       SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY date
       ORDER BY date ASC`,
      [userId]
    );

    const analyticsData = {
      categories: cat.rows,
      monthly: monthly.rows,
      trend: trend.rows,
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const prompt = `
You are an AI financial insights engine. 
Generate short, clear, bullet-point insights only. No long paragraphs.

FORMAT STRICTLY LIKE THIS:

📝 Key Highlights
• (1 line insight)
• (1 line insight)
• (1 line insight)

📊 Category Breakdown
• Top category: (category + ₹amount)
• (Short note about increases/decreases)
• (Short note about wasteful spending)

📅 Behavior Patterns
• Weekday vs weekend summary (1 line)
• Highest spend day (1 line)
• Any unusual pattern (1 line)

💡 Savings Tips
• Tip 1 (very short)
• Tip 2 (very short)
• Tip 3 (very short)

🔮 Prediction
• Next month spend prediction (1 short line)

⚠ Alerts
• (Only if something looks unusual, keep it 1 line)

Make everything short, clear, and professional.

USER DATA:
${JSON.stringify(analyticsData, null, 2)}
`;

    let responseText = null;
    let lastError = null;
    let modelUsed = null;

    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);

        responseText = result.response.text();
        modelUsed = modelName;

        console.log(`Success - model used: ${modelName}`);
        break;
      } catch (err) {
        const status = getStatus(err);
        lastError = err;

        console.log(`Failed model: ${modelName}`, {
          status,
          message: err?.message,
        });

        // if overloaded / rate limited / server unstable => try next model
        if ([429, 500, 502, 503, 504].includes(status)) {
          continue;
        }

        // unknown error -> still try next model (recommended)
        continue;
      }
    }

    if (!responseText) {
      return res.status(503).json({
        message:
          "All AI models are temporarily unavailable (overloaded). Try again shortly.",
        error: lastError?.message,
      });
    }

    return res.json({
      insights: responseText,
      model_used: modelUsed,
    });
  } catch (err) {
    console.error("AI Insights Error:", err);
    return res.status(500).json({ message: "AI insights error" });
  }
};
