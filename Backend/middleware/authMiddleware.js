import jwt from 'jsonwebtoken';

export const authenticate = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        console.log(`${token}`)
        return res.status(401).json({error:"no token provided"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:",decoded);
        req.user = decoded;
        next();
    }catch(err){
        console.log("jwt verification error:",err.message)
        res.status(403).json({error:"invalid token"});
    }
};