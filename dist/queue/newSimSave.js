"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchData_1 = require("../fetchApi/fetchData");
const login_model_1 = __importDefault(require("../models/login.model"));
const sim_model_1 = __importDefault(require("../models/sim.model"));
const bull_1 = __importDefault(require("bull"));
const newSimQueue = new bull_1.default("new sim", {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
});
// Xử lý job trong queue
newSimQueue.process(async (job, done) => {
    try {
        const { token } = job.data;
        const getAllSim = await sim_model_1.default.find({});
        const lengthAllSim = getAllSim.length;
        const listSimNew = [];
        const fetchDataApi = fetchData_1.listDataFetch;
        fetchDataApi.forEach((item) => {
            const { iccid } = item;
            if (lengthAllSim < 1) {
                listSimNew.push(iccid);
            }
            else {
                const listIccid = getAllSim.map((item) => item.iccid);
                if (!listIccid.includes(iccid)) {
                    listSimNew.push(iccid);
                }
            }
        });
        const newSims = listSimNew.map((simNew) => ({ iccid: simNew }));
        await sim_model_1.default.insertMany(newSims);
        done();
    }
    catch (error) {
        console.error("Error processing job:", error);
        done(new Error("Job failed"));
    }
});
const newSimQueueProcess = async () => {
    const data = await login_model_1.default.findOne({});
    const { token_nce: token } = data;
    await newSimQueue.add({ token });
};
exports.default = newSimQueueProcess;
