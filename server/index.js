import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Tours from "./models/Tours.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";
import { login, signup } from "./controllers/auth.js";
import { gettours, posttours } from "./controllers/tours.js";
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

app.post("/tours", verifyjwt, posttours);

app.get("/tours", verifyjwt, gettours);

app.post("/signup", signup);

app.post("/login", login);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("database connected successfully");
};

app.listen(Port, () => {
  console.log(`Server is running on the ${Port}`);
  connectDB();
});
