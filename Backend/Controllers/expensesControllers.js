import pool from "../db.js";

console.log('DB connected successfully!');

//get all expenses
export const getExpenses = async (req,res) => {
    try{
        const userId = req.user.id;
        const result = await pool.query("SELECT * FROM expenses WHERE user_id=$1 ORDER BY id ASC",[userId]);
        res.json(result.rows);
    }catch(err){
        console.error("database error:",err.message);
        res.status(500).json({error: err.message});
    }
}

//add all expenses
export const addExpenses = async (req,res) => {
    const {title,amount,category,date,recurring="none",note} = req.body;
    const userId = req.user.id;
    console.log(req.body);
    const safeRecurring = typeof recurring === "string" && recurring.trim() ? recurring.trim() : "none";

    try{
        const result = await pool.query("INSERT INTO expenses (title,amount,category,date,recurring,note,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [title,amount,category,date,safeRecurring,note,userId]
        );
        res.json(result.rows);
    }catch(err){
        console.log("database error:",err.message);
        res.status(500).json({error:err.message});
    }  
}

//update the expenses
export const updateExpenses = async (req,res) => {
    const {id} = req.params;
    const userId = req.user.id;
    const {title,amount,category,date,recurring="none",note} = req.body;
    console.log(req.params , req.body);

    const safeRecurring = typeof recurring === "string" && recurring.trim() ? recurring.trim() : "none";

    try{
        const result = await pool.query("UPDATE expenses SET title=$1,amount=$2,category=$3,date=$4,recurring=$5,note=$6 WHERE id=$7 AND user_id=$8 RETURNING *",
            [title,amount,category,date,safeRecurring,note,id,userId]
        );
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

//delete the expenses
export const deleteExpenses = async(req,res) => {
    const {id} = req.params;

    try{
        const result = await pool.query("DELETE FROM expenses WHERE id=$1",[id]);
        res.json({message:"Expenses deleted"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
}