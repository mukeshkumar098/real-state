const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken"); 
const nodemailer=require("nodemailer");
const { userModel } = require("../Models/userModel");
const propertyModel = require("../Models/PropertyModel");




// User Registration
// User Registration
const userRigster = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (role === "admin") {
      let adminExists = await userModel.findOne({ role: "admin" });
      if (adminExists) {
        return res.status(403).json({ message: "An Admin already exists!" });
      }
    }
    bcrypt.hash(password, +process.env.SALT_ROUND, async (err, hash) => {
      if (err) {

        console.error(err);
        return res.status(500).json({ message: "we can not add nother Admin " });
      }; const user = new userModel({ name, email, password: hash, role });
      await user.save();

    });



    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}


// User Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1d" }, (err, token) => {

      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
      }

      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    });


  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


const forgetPassword=async(req,res)=>{
  try {
    const {email}=req.body;
    if(!email){
      res.status(400).send({message:"please provid emaiil"})
    }
    const checkUser=await userModel.findOne({email});
  console.log(checkUser);
  
    if(!checkUser){
      res.status(400).send({messsage:"User not Found please register"})
    }
    const token =jwt.sign({email},process.env.SECRET_KEY,{expiresIn:"1d"})
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD, // Use `pass` instead of `password`
      },
    });
    const reciever={
      from:"",
      to:email,
      subject:"password reset request",
      text:`Click on this link generate your new password ${process.env.CLIENT_URL}/reset-password/${token}`
    };
    await transporter.sendMail(reciever);
    res.status(200).send({message:"password reset link send successfully on your gamil account "})
  } catch (error) {
    console.log(error)
     return res.status(500).send({message:"Something went wrong"});

  }
}


const resetPassword=async(req,res)=>{
  try {
    let {token}=req.params;
    console.log(token,"token");
    
    let {email,password}=req.body;
    if(!password){
      res.status(400).send({message:"please provide password"})
    }
 

    console.log(password,"password");
    
   jwt.verify(token, process.env.SECRET_KEY,(err,result)=>{
    console.log(result,"result");
   });

    
   const user=await userModel.findOne({email:decode.email})


    console.log(user,"bsvjbndfh  g");
    
    //  if(!user){
    //   res.send({
    //     message:"user not found "
    //   })
    //   const hashpassword = await bcrypt.hash(password, 10)
    //   console.log(hashpassword,"hello")

    //   user.password=hashpassword;
    //   await user.save()
    //   // const updatePassword = await userModel.updateOne(
    //   //     { email },
    //   //     { $set: { password: hashpassword } }
    //   // );
    //   return res.status(200).send({
    //     message:"passwor forgot successfully and reset successfully"
    //   })
    //  }
  } catch (error) {
      return res.status(500).send({message:"Something went wrong"});
  }
}

const addProperties = async (req, res) => {
  try {
      const { title, description, price, location } = req.body;
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

      if (!title || !description || !price || !location) {
          return res.status(400).json({ message: "All fields are required" });
      }
      const newProperty = new propertyModel({
          title,
          description,
          price,
          location,
          seller: req.user.id, 
      });

      await newProperty.save();

      res.status(201).json({ message: "Property added successfully", property: newProperty });
  } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Error adding property", error });
  }
};
module.exports = addProperties;




module.exports = {
  userRigster,
  userLogin,
  forgetPassword,
  resetPassword,
  addProperties
};




