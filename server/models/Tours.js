import { Schema, model } from "mongoose";

const tourSchems = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  user: { tpye: Schema.Types.ObjectId, ref: "User", required: true },
  photos:{type:[String],default:[]},
});

const Tours = model("Tours", tourSchems);

export default Tours;
