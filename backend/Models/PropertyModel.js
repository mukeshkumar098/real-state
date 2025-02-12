

const mongoose=require("mongoose");
const propertiesSchema = require("../Schemas/PropertiesShema");


const propertyModel = mongoose.model("Property", propertiesSchema);


module.exports=propertyModel