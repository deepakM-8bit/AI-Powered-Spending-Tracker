import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "../db.js";

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

    // Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ⭐ SHORT, CLEAN, PROFESSIONAL FINTECH PROMPT
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

    const result = await model.generateContent(prompt);

    res.json({
      insights: result.response.text(),
    });

  } catch (err) {
    console.error("AI Insights Error:", err);
    res.status(500).json({ message: "AI insights error" });
  }
};
