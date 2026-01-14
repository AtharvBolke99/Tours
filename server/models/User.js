import { Schema, model } from "mongoose";

const newUserSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  mobile: { type: String },
  city: { type: String },
  contry: { type: String },
  password: { type: String, require: true },
});

const User = model("User", "newUserSchema");

export default newUserSchema;
