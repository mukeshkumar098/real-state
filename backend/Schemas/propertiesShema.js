const mongoose=require("mongoose")


const propertiesSchema=mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the seller
    createdAt: { type: Date, default: Date.now }
})


module.exports=propertiesSchema