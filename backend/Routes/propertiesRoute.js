const express=require("express");
const { getAllProperties, updateProperty, deleteProperty, getPropertyById, searchProperties } = require("../Controller/propertyController");

const propertiesRoute=express.Router();

propertiesRoute.get("getProperties",getAllProperties)
propertiesRoute.put("updateProperty",updateProperty)
propertiesRoute.delete("deleteProperty",deleteProperty)
propertiesRoute.get("getPropertyById",getPropertyById)
propertiesRoute.get("searchProperties",searchProperties)


module.exports={propertiesRoute}