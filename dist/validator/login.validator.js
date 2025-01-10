"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object({
    username: joi_1.default.string().min(1).required().messages({
        "string.min": "Username must be at least 3 characters long.",
        "any.required": "Username is required.",
    }),
    password: joi_1.default.string().min(1).required().messages({
        "string.min": "Password must be at least 6 characters long.",
        "any.required": "Password is required.",
    }),
});
exports.default = loginSchema;
