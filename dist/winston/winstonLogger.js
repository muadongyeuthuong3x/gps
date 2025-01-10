"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const path_1 = __importDefault(require("path"));
const customFormat = winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
}));
const winstonLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: customFormat,
    transports: [
        new winston_1.transports.File({
            filename: path_1.default.join(__dirname, 'logger/loggerEvent.log'),
            level: 'info',
        }),
        new winston_1.transports.Console({
            format: winston_1.format.simple()
        })
    ],
});
exports.default = winstonLogger;
