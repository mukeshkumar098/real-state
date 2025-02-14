const express=require("express")
const cors=require("cors")

const { dbConnected } = require("./Config/db")
const { userRoute } = require("./Routes/userRoute")
const { propertiesRoute } = require("./Routes/propertiesRoute")

const app=express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
require("dotenv").config()

app.use(express.json());


app.use("/user",userRoute)
app.use("/properties",propertiesRoute)
app.listen(process.env.PORT,()=>{
    dbConnected()
    console.log(`server running on port ${process.env.PORT}`);
    
})
