const express=require("express");
const { getAllProperties, updateProperty, deleteProperty, getPropertyById, searchProperties } = require("../Controller/propertyController");

const propertiesRoute=express.Router();

propertiesRoute.get("/getProperties",getAllProperties)
propertiesRoute.put("/updateProperty",updateProperty)
propertiesRoute.delete("/deleteProperty/:id",deleteProperty)
propertiesRoute.get("/getPropertyById/:id",getPropertyById)
propertiesRoute.get("/searchProperties/search",searchProperties)


module.exports={propertiesRoute}