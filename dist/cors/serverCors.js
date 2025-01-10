"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const corsConfig = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};
exports.default = corsConfig;
