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

// forget pass or reset pass controller

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.status(400).send({ message: "please provide valid email" });
    }
    const checkUser = await userModel.findOne({ email });
    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "user not found please register" });
    }
    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD
      },
    });


    // console.log(transporter);
    
    const receiver = {
      from: "",
      to: email,
      subject: "password reset request",
      text: `click on this link to generate new password ${process.env.CLIENT_URL}/reset-password/${token}`,
    };
    await transporter.sendMail(receiver);

    return res
      .status(200)
      .send({
        message: "password reset link send successfully on your gmail account",
      });
  } catch (error) {
    res.status(400).send({ message: "something went wrong!" });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { email,password } = req.body;
    if (!password) {
        res.status(400).send({mesage:"please provide password !!"})
    }
    const decode = jwt.verify(token,process.env.SECRET_KEY);
    console.log(decode,'check');
    const user=await userModel.findOne({email:decode.email});
    console.log(user);

    // const newUser= await userModel({email, password});
    bcrypt.hash(password, +process.env.SALT_ROUNDS, async (err, hash) => {
        if (err) {
          res.status(500).send(err, "error while register user!");
        }
        // let newUser = userModel({ password: hash});
        // console.log(password,'password');
        await user.updateOne({password:hash});
        console.log(user, 'updated user');
        res
          .status(200)
          .send({ success: true, message: "user password reset successfully" });
      });

  } catch (error) {
    res.status(400).send({ message: "something went wrong!" });
  }
};


module.exports = {
  userRigster,
  userLogin,
  forgetPassword,
  resetPassword,
};




