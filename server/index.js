import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Tours from "./models/Tours.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const Port = process.env.PORT;

const verifyjwt = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid or Missing Token",
    });
  }
};

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

app.post("/tours", verifyjwt, async (req, res) => {
  const { title, description, startDate, endDate, user, photos } = req.body;
  const newTour = new Tours({
    title,
    description,
    startDate,
    endDate,
    user: req.user.id,
    photos,
  });

  try {
    const saveTour = await newTour.save();
    return res.json({
      status: true,
      message: "Tour created successfully",
      data: saveTour,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
});

app.get("/tours", verifyjwt, async (req, res) => {
  try {
    const tours = await Tours.find({ user: req.user.id }).populate(
      "user",
      "-password",
    );
    return res.json({
      status: true,
      message: "Tours fetched successfully",
      data: tours,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
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

  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    mobile,
    city,
    country,
    password: encryptedPassword,
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
});

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("database connected successfully");
};

app.listen(Port, () => {
  console.log(`Server is running on the ${Port}`);
  connectDB();
});
