"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const winstonLogger_1 = __importDefault(require("../winston/winstonLogger"));
class Database {
    constructor() {
        this.connection = null;
    }
    async connect(uri) {
        if (this.connection) {
            return this.connection;
        }
        try {
            await mongoose_1.default.connect(uri);
            this.connection = mongoose_1.default.connection;
            // this.connection.once('open', () => {
            //     winstonLogger.info("Connect success");
            // });
            this.connection.on('error', (error) => {
                winstonLogger_1.default.error("Connection error:", error);
            });
        }
        catch (error) {
            winstonLogger_1.default.error(error);
            throw error;
        }
        return this.connection;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
exports.default = Database;
