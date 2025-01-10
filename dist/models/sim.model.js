"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../enum");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const simSchema = new Schema({
    iccid: { type: String, require: true },
    quota: { type: Number, min: 20, default: 20 },
    bank: { type: String, enum: enum_1.banks, default: enum_1.banks[0] }
}, { timestamps: true });
const SimSchema = mongoose.model("Sim", simSchema);
exports.default = SimSchema;
