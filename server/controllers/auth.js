import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

dotenv.config();


const signup = async (req, res) => {
  const { name, email, mobile, city, country, password, profilePhoto } = req.body;

  if (!name) {
    res.json({
      status: false,
      message: "Name is requied",
      data: null,
    });
  }

  if (!email) {
    res.json({
      status: false,
      message: "Email is requied",
      data: null,
    });
  }

  if (!password) {
    res.json({
      status: false,
      message: "Password is requied",
      data: null,
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    mobile,
    city,
    country,
    password: encryptedPassword,
    profilePhoto,
  });

  const exsistingUser = await User.findOne({ email });

  if (exsistingUser) {
    return res.json({
      status: false,
      message: "Email already exists",
    });
  }

  try {
    const saveUser = await newUser.save();
    res.json({
      status: true,
      message: "User Saved successfully",
      data: saveUser,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "failed to save the details",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const exsistingUser = await User.findOne({ email });

  if (!exsistingUser) {
    return res.json({
      status: false,
      message: "Account with this email is not exsists",
    });
  }

  const isCorrectPassword = bcrypt.compareSync(
    password,
    exsistingUser.password,
  );

  exsistingUser.password = undefined;

  if (isCorrectPassword) {
    const token = jwt.sign(
      { id: exsistingUser._id, email: exsistingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.json({
      status: true,
      message: "Login Successfully",
      jwtToken: token,
    });
  } else {
    return res.json({
      status: false,
      message: "Invalid Email or Password",
      jwtToken: null,
    });
  }
};

export {signup, login};