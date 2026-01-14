import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

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

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("database connected successfully");
};

app.listen("PORT", () => {
  console.log(`Server is running on the ${PORT}`);
  connectDB();
});
