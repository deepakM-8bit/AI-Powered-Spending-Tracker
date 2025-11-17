import pool from "../db.js";

export const getAnalytics = async(req,res) => {
    const userId = req.user.id;

    try{
        //category totals
        const categoryQuery = await pool.query(
            `SELECT category, SUM(amount) AS total
            FROM expenses WHERE user_id=$1
            GROUP BY category
            ORDER BY total DESC`,[userId]
        );

        //monthly totals
        const monthQuery = await pool.query(
            `SELECT TO_CHAR("date", 'YYYY-MM') AS month,
            SUM(amount) AS total
            FROM expenses WHERE user_id=$1
            GROUP BY TO_CHAR("date", 'YYYY-MM')
            ORDER BY month ASC`,[userId]
        );

        //daily trends
        const trendQuery = await pool.query(
            `SELECT "date"::date AS date,
            TO_CHAR("date", 'Day') AS day,
            SUM(amount) AS total
            FROM expenses WHERE user_id=$1
            GROUP BY date, day
            ORDER BY date ASC`,[userId]
        );

    // MONTHLY CATEGORY TOTALS (NEW)
    const monthlyCategoryQuery = await pool.query(
      `SELECT 
         TO_CHAR("date", 'YYYY-MM') AS month,
         category,
         SUM(amount) AS total
       FROM expenses
       WHERE user_id=$1
       GROUP BY month, category
       ORDER BY month ASC, total DESC`,
      [userId]
    );


    //  YEARLY TOTALS (YYYY)
    const yearlyTotalsQuery = await pool.query(
      `SELECT 
         TO_CHAR("date", 'YYYY') AS year,
         SUM(amount) AS total
       FROM expenses
       WHERE user_id=$1
       GROUP BY year
       ORDER BY year ASC`,
      [userId]
    );


    //  YEARLY CATEGORY TOTALS    
    const yearlyCategoryQuery = await pool.query(
      `SELECT 
         TO_CHAR("date", 'YYYY') AS year,
         category,
         SUM(amount) AS total
       FROM expenses
       WHERE user_id=$1
       GROUP BY year, category
       ORDER BY year ASC, total DESC`,
      [userId]
    );

        return res.json({
            categoryTotals:categoryQuery.rows,
            monthlyTotals: monthQuery.rows,
            dailyTrend: trendQuery.rows,
            monthlyCategoryTotals: monthlyCategoryQuery.rows,
            yearlyTotals: yearlyTotalsQuery.rows,
            yearlyCategoryTotals: yearlyCategoryQuery.rows,
        });

    }catch(err){
        console.error(err);
        return res.status(500).json({message:"analytics fetch error"});
    }
}