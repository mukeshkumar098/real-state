

const jwt=require('jsonwebtoken')
const { userModel } = require('../Models/userModel');



 const verifyRole = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]
      console.log("token",token,"jdnasdbjhb");

      if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided in Authorization header." });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      // console.log(decoded.id,'check')
      

      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: `Access denied. Required role: ${roles.join(", ")}` });
      }
      console.log(user.role);
      
      next(); 
    } catch (error) {
      console.error("Token Error:", error.message);
      res.status(500).json({ message: "Invalid token or server error" });
    }
  };
};





module.exports=verifyRole




