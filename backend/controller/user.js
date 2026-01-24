const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//--handle signup
const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email Allready Regestred" });
    }

    //password hashed
    const hash_Password = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash_Password,
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email,role:newUser.role},
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User Signup Successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email,role:newUser.role },
    });
  } catch (error) {
    return res.status(500).json({ message: "signup Fialed" });
  }
};

/* =====================
   USER LOGIN
===================== */

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
   const user=await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User Does not exist" });
    }

    const password_matched = await bcrypt.compare(password, user.password);

    if (!password_matched) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email,role:user.role},
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login Success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role:user.role
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failded" });
  }
};

/* =====================
   GET USER (PROFILE)
===================== */

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({
      message: "Invalid user ID",
    });
  }
};

module.exports = {
  userSignup,
  userLogin,
  getUserProfile
};
