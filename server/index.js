import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const Port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to the TineyTours",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: true,
    message: "Server is Healthy",
  });
});

app.post("/signup", async (req, res) => {
  const { name, email, mobile, city, country, password } = req.body;

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

  const newUser = new User({
    name,
    email,
    mobile,
    city,
    country,
    password,
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
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const exsistingUser = await User.findOne({ email, password });

  if (!exsistingUser) {
    return res.json({
      status: false,
      message: "Invalid email or password.",
    });
  } else {
    res.json({
      status: true,
      message: "Login Successfully..",
    });
  }
});

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("database connected successfully");
};

app.listen(Port, () => {
  console.log(`Server is running on the ${Port}`);
  connectDB();
});
