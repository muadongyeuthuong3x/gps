"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotaSim = void 0;
const bull_1 = __importDefault(require("bull"));
const fetchData_1 = require("../fetchApi/fetchData");
const winstonLogger_1 = __importDefault(require("../winston/winstonLogger"));
const sim_model_1 = __importDefault(require("../models/sim.model"));
const sim_service_1 = __importDefault(require("../services/sim.service"));
const login_model_1 = __importDefault(require("../models/login.model"));
const enum_1 = require("../enum");
const getAllSimQueue = new bull_1.default("all sim queue", {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
});
getAllSimQueue.process(async (job, done) => {
    try {
        const { token } = job.data;
        // const options = {
        //   method: "GET",
        //   url: process.env.NCE_TOKEN,
        //   headers: {
        //     accept: "application/json",
        //     "content-type": "application/json",
        //     authorization: `Bearer ${token}`,
        //   },
        // };
        // const response = await axios(options);
        const fetchDataApi = fetchData_1.listDataFetch;
        const quotaSim = await sim_model_1.default.find({});
        const listSimCustom = {};
        if (quotaSim.length < 1)
            return;
        fetchDataApi.forEach((item) => {
            const checkAddQouta = (0, exports.getQuotaSim)(item, quotaSim);
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
                bank: ""
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
    }
    catch (error) {
        winstonLogger_1.default.error("Error job getInformation all SIm:", error);
        done(new Error("Job failed"));
    }
});
const getQuotaSim = (item, quotaSim) => {
    let addQuota = {};
    const { iccid: iccidGet, current_quota } = item;
    quotaSim.forEach((sim) => {
        const { quota, iccid } = sim;
        if (iccid == iccidGet) {
            if (current_quota < quota) {
                addQuota = sim;
            }
        }
    });
    return addQuota;
};
exports.getQuotaSim = getQuotaSim;
const scheduleJob = async () => {
    const data = await login_model_1.default.findOne({});
    const { token_nce: token } = data;
    await getAllSimQueue.add({ token });
};
exports.default = scheduleJob;
