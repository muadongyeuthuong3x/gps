"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./database/db"));
const serverCors_1 = __importDefault(require("./cors/serverCors"));
const router_1 = __importDefault(require("./routers/router"));
const getAllSimAddData_1 = __importDefault(require("./queue/getAllSimAddData"));
const node_cron_1 = __importDefault(require("node-cron"));
const newSimSave_1 = __importDefault(require("./queue/newSimSave"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)(serverCors_1.default));
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "winston/logger/loggerRequest.log"), { flags: "a" });
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use((0, morgan_1.default)((tokens, req, res) => {
    const timestamp = new Date().toISOString();
    return [
        timestamp,
        "-",
        tokens.method(req, res),
        "-",
        tokens.url(req, res),
        "-",
        tokens.status(req, res),
        "-",
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
    ].join(" ");
}));
const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL ?? "";
console.log(2222222222222, PORT, URL);
//*/5 * * * *
node_cron_1.default.schedule('*/30 * * * * *', async () => {
    await (0, getAllSimAddData_1.default)();
});
// Chạy newSimQueueProcess mỗi 15 giây
node_cron_1.default.schedule('*/15 * * * * *', async () => {
    await (0, newSimSave_1.default)();
});
app.use(express_1.default.json());
app.use('/api', router_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
const startServer = async () => {
    const db = db_1.default.getInstance();
    await db.connect(URL);
    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
startServer().catch(error => {
    console.error("Error starting server:", error);
});
