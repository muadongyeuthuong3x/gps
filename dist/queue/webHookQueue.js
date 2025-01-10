"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const login_model_1 = __importDefault(require("../models/login.model"));
const getAllSimAddData_1 = require("./getAllSimAddData");
const sim_model_1 = __importDefault(require("../models/sim.model"));
const enum_1 = require("../enum");
const sim_service_1 = __importDefault(require("../services/sim.service"));
// Tạo queue
const taskQueue = new bull_1.default("task queue");
taskQueue.process(1, async (job, done) => {
    const { token, fetchDataApi } = job.data;
    const quotaSim = await sim_model_1.default.find({});
    const listSimCustom = {};
    if (quotaSim.length < 1)
        return;
    fetchDataApi.forEach((item) => {
        const checkAddQouta = (0, getAllSimAddData_1.getQuotaSim)(item, quotaSim);
        if (JSON.stringify(checkAddQouta) !== "{}") {
            const { bank } = checkAddQouta;
            if (!listSimCustom[bank]) {
                listSimCustom[bank] = [];
            }
            listSimCustom[bank].push(checkAddQouta);
        }
    });
    for (const bank of enum_1.banks) {
        const item = {
            sims: [],
            bank: "",
        };
        item.token_nce = token;
        if (listSimCustom[bank] !== undefined && listSimCustom[bank].length > 1) {
            const simsA = [];
            listSimCustom[bank].map((e) => {
                const { iccid } = e;
                simsA.push(iccid);
            });
            item.bank = bank;
            item.sims = simsA;
            await sim_service_1.default.addVolumeInSims(item);
        }
    }
    done();
});
const enqueueTasks = async (dataProps) => {
    console.log(dataProps);
    if (dataProps.length < 1)
        return;
    const data = await login_model_1.default.findOne();
    const { token_nce: token } = data;
    await taskQueue.add({ token, fetchDataApi: dataProps });
    console.log(`Job for  completed.`);
};
exports.default = enqueueTasks;
