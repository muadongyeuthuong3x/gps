"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    user_infor_base64: { type: String, require: true },
    token_nce: { type: String, default: "" },
}, { timestamps: true });
const UserSchema = mongoose.model('User', userSchema);
exports.default = UserSchema;
