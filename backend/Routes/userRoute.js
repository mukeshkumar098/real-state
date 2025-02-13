const express=require("express");
const { userRigster, userLogin, resetPassword, forgetPassword} = require("../Controller/userController");
const verifyRole = require("../Middelware/isAuthendicate");
const adminVarifyedSeller = require("../Middelware/verifySeller");
const addProperties = require("../Controller/propertyController");
const userRoute=express.Router();


userRoute.post("/register",userRigster)
userRoute.post("/login",userLogin);
userRoute.post("/forgot-password",forgetPassword);
userRoute.patch("/reset-password/:token",resetPassword)
userRoute.put("/admin-verify-seller/:id", verifyRole(["admin"]), adminVarifyedSeller);
// userRoute.post("/add-properties",verifyRole(["seller"]),addProperties)

// userRoute.put("/reset-password/:token",resetPassword);


module.exports={userRoute}