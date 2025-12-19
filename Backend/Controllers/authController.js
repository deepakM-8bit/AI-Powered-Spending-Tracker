import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from "../db.js";

//signup user
export const registerUser = async (req,res)=> {
        const {email,name,password} = req.body;

        try{
            //check if user already registered
            const result = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
            if(result.rowCount > 0){
                return res.status(404).json({message:"User already exist"});
            }
                //hashing password
                const hashedPassword = await bcrypt.hash(password,10);

                //insert the new user data
                const insertResult = await pool.query("INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id",
                 [name,email,hashedPassword]);
                res.status(200).json({userId: insertResult.rows[0].id,message:"user registerd succesfully"});
         }catch(err){
            res.status(500).json(err.message);
         }
}

//login user
export const loginUser = async (req,res)=>{
        const {email,password} = req.body;
        try{
            //check if user exist
            const result = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
            if(result.rowCount === 0){
               return res.status(404).json({message:"user not registered"});
            }

            const user = result.rows[0];

            //compare password with hash password
            const valid = await bcrypt.compare(password, user.password);
            if(!valid){
                return res.status(403).json({error:"wrong password"})
            }

            //generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email, name:user.name }, process.env.JWT_SECRET, {expiresIn: "3d"});
            res.json({
                message:"user found",
                token: token,
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email
                }
            });
        }catch(err){
            res.status(500).json(err.message);
        }
};