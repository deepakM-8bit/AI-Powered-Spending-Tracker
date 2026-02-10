import pool from "../db.js";

export const aiInsights = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Fetch Categories
    const cat = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY category`,
      [userId],
    );

    // 2. Fetch Monthly Trends
    const monthly = await pool.query(
      `SELECT TO_CHAR("date", 'YYYY-MM') AS month,
       SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY month
       ORDER BY month ASC`,
      [userId],
    );

    // 3. Fetch Daily Trends
    const trend = await pool.query(
      `SELECT "date"::date AS date,
       SUM(amount) AS total
       FROM expenses WHERE user_id=$1
       GROUP BY date
       ORDER BY date ASC`,
      [userId],
    );

    // 4. Structure the Data
    const analyticsData = {
      categories: cat.rows,
      monthly: monthly.rows,
      trend: trend.rows,
    };

    console.log(`Analytics data fetched successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      data: analyticsData,
      message: "Data fetched. Ready for AI processing on Vercel.",
    });
  } catch (err) {
    console.error("Data Fetch Error:", err);
    return res.status(500).json({ message: "Error fetching analytics data" });
  }
};
