const mongoose=require("mongoose");
const { UserSchema } = require("../Schemas/userSchema");


const userModel=mongoose.model("User",UserSchema)

module.exports={userModel}