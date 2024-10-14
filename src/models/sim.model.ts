import { banks } from "../enum";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const simSchema = new Schema(
  {
    iccid: { type: String, require: true },
    quota: { type: Number, min: 20, default: 20 },
    bank : { type: String, enum: banks, default: banks[0]}
  },
  { timestamps: true }
);

const SimSchema = mongoose.model("Sim", simSchema);

export default SimSchema;
