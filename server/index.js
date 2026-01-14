import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected successfully");

}

app.listen("PORT", () => {
    console.log(`Server is running on the ${PORT}`);
    connectDB();
})