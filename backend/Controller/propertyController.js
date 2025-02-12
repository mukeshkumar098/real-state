const propertyModel = require("../Models/PropertyModel");
const { userModel } = require("../Models/userModel");

const addProperties = async (req, res) => {
    try {
        const { title, description,property_type,latitude,longitude, price, location } = req.body;
        console.log(req.user.id,"asdbsdsabdhb");
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Please log in" });
        }
  
        const seller = await userModel.findById(req.user.id);
  
  
        console.log(seller,"seller");
        
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({ message: "Only sellers can add properties" });
        }
  
        if (!seller.isVerified) {
            return res.status(403).json({ message: "You must be verified by an admin to add properties" });
        }
  
        if (!title || !description || !price || !location ||!property_type||!latitude||!longitude) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newProperty = new propertyModel({
            title,
            description,
            price,
            location,
            property_type,
            latitude,
            longitude,
            seller: req.user.id, 
        });
  
        await newProperty.save();
  
        res.status(201).json({ message: "Property added successfully", property: newProperty });
    } catch (error) {
        console.error("Error adding property:", error);
        res.status(500).json({ message: "Error adding property", error });
    }
  };



  const getAllProperties = async (req, res) => {
    try {
      const properties = await propertyModel.find();
      res.status(200).json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  const updateProperty = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Server error" });
    }
  };



  const deleteProperty = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      
  
      const deletedProperty = await propertyModel.findByIdAndDelete(id);
  
      if (!deletedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


 const getPropertyById = async (req, res) => {
    try {
      const { id } = req.params;
      const property = await propertyModel.findById(id);
  
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      res.status(200).json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Server error" });
    }
  };





  const searchProperties = async (req, res) => {
    try {
      const { location, price, property_type, } = req.query;
      
      const filter = {};
      if (location) filter.location = { $regex: location, $options: "i" };
      // if (city) filter.city = { $regex: city, $options: "i" };
      if (type) filter.type = { $regex: property_type, $options: "i" };
      if (price) filter.price = { $lte: Number(price) }; 
  
      const properties = await propertyModel.find(filter);
      res.status(200).json(properties);
    } catch (error) {
      console.error("Error searching properties:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  module.exports = {addProperties,getAllProperties,getPropertyById,updateProperty,searchProperties,deleteProperty};