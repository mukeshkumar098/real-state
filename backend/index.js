const express=require("express")
const cors=require("cors")
const { dbConnected } = require("./Config/db")
const { userRoute } = require("./Routes/userRoute")
const verifyRole = require("./Middelware/isAuthendicate")

const app=express()
require("dotenv").config()

app.use(express.json());
app.use(cors());


app.use("/user",userRoute)
app.listen(process.env.PORT,()=>{
    dbConnected()
    console.log(`server running on port ${process.env.PORT}`);
    
})
