const mongoose=require("mongoose");
const { exit } = require("process");


const dbConnected=async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URL)
        console.log("db Connected ssuccessfully");
        
    } catch (error) {
        console.log(error,"error while connecting db");
        exit(1)
        
    }
}
module.exports={dbConnected}