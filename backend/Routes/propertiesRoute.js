const express=require("express");
const { getAllProperties, updateProperty, deleteProperty, getPropertyById, searchProperties, addProperties } = require("../Controller/propertyController");
const verifyRole = require("../Middelware/isAuthendicate");

const propertiesRoute=express.Router();
propertiesRoute.post("/add-properties",verifyRole(["seller"]),addProperties)
propertiesRoute.get("/getProperties",getAllProperties)
propertiesRoute.put("/updateProperty/:id", verifyRole(["seller", "admin"]),updateProperty)
propertiesRoute.delete("/deleteProperty/:id",deleteProperty)
propertiesRoute.get("/getPropertyById/:id",getPropertyById)
propertiesRoute.get("/searchProperties/search",searchProperties)


module.exports={propertiesRoute}