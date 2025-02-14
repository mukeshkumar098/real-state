const express=require("express");
const { getAllProperties, updateProperty, deleteProperty, getPropertyById, searchProperties, addProperties } = require("../Controller/propertyController");
const verifyRole = require("../Middelware/isAuthendicate");

const propertiesRoute=express.Router();

propertiesRoute.get("/getProperties",getAllProperties)
propertiesRoute.post('/add-properties',verifyRole(['seller']),addProperties)
propertiesRoute.put("/update-property/:id",verifyRole(['seller', 'admin']), updateProperty)
propertiesRoute.delete("/delete-property/:id", verifyRole(['seller', 'admin']) ,deleteProperty)
propertiesRoute.get("/getPropertyById/:id",getPropertyById)
propertiesRoute.get("/searchProperties/search",searchProperties)


module.exports={propertiesRoute}