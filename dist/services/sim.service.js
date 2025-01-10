"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const login_validator_1 = __importDefault(require("../validator/login.validator"));
const login_model_1 = __importDefault(require("../models/login.model"));
const winstonLogger_1 = __importDefault(require("../winston/winstonLogger"));
const enum_1 = require("../enum");
const bcrypt = require('bcryptjs');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const fetchDataWebHook_1 = require("../fetchWebHook/fetchDataWebHook");
const webHookQueue_1 = __importDefault(require("../queue/webHookQueue"));
const saltRounds = 10;
const SimService = {
    saveInformationSim: async (req, res) => {
        const { username, password } = req.body;
        const { error } = login_validator_1.default.validate({ username, password });
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        try {
            const checkExistUser = await login_model_1.default.findOne({ username });
            if (checkExistUser) {
                const { token_nce } = checkExistUser;
                if (!token_nce) {
                    res.status(404).json({ message: "You no setting data nce" });
                    return;
                }
                res.status(404).json({ message: "User exists in database" });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Uncomment and implement this block if needed
            /*
            const options = {
              method: "POST",
              url: process.env.NCE_TOKEN,
              headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Basic ${user_infor_base64}`,
              },
              data: {
                grant_type: "client_credentials",
              },
            };
      
            const response = await axios(options);
            getToken1NCE = response.data; // Ensure you're getting the token correctly
            */
            const user_infor_base64 = Buffer.from(`${username}:${password}`).toString("base64");
            let getToken1NCE = user_infor_base64;
            const newUser = new login_model_1.default({
                username,
                password: hashedPassword,
                user_infor_base64,
                token_nce: getToken1NCE,
            });
            await newUser.save();
            const token = (0, exports.generateToken)({ username, token_nce: getToken1NCE });
            res.status(201).json({ message: "Success", token });
        }
        catch (error) {
            winstonLogger_1.default.error("Error saving user information:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getInformation: async (req, res) => {
        res.status(201).json({ message: "manh cuong cicde22222222222222222222222" });
    },
    addVolumeInSims: async (data) => {
        const { sims, bank, token_nce } = data;
        if (!enum_1.banks.includes(bank)) {
            winstonLogger_1.default.error("addVolumeInSims errors: Bank not found");
            return;
        }
        const maxRetries = 3;
        let attempts = 0;
        let success = false;
        while (attempts < maxRetries && !success) {
            try {
                const options = {
                    method: "OPTIONS",
                    url: `${process.env.NCE_TOKEN}/topup?payment_method=${bank}`,
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${token_nce}`,
                        "content-type": "application/json",
                    },
                    data: sims,
                };
                const response = await (0, axios_1.default)(options);
                winstonLogger_1.default.info("addVolumeInSims success:", { sims, bank });
                success = true;
            }
            catch (error) {
                attempts++;
                winstonLogger_1.default.error("addVolumeInSims error on attempt", attempts, ":", error);
            }
        }
        if (!success) {
            winstonLogger_1.default.error("addVolumeInSims failed after 3 attempts");
        }
    },
    loginWeb: async (req, res) => {
        const { username, password } = req.body;
        try {
            const data = await login_model_1.default.findOne({ username }).select("username password token_nce");
            if (!data) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const { password: passwordDb, token_nce } = data;
            const isMatch = await bcrypt.compare(password, passwordDb);
            if (!isMatch) {
                res.status(404).json({ message: "Password not found" });
                return;
            }
            const token = (0, exports.generateToken)({ username, token_nce });
            res.json({ token });
            return;
        }
        catch (error) {
            winstonLogger_1.default.error("Login:", error);
            res.status(500).json({ message: error });
            return;
        }
    },
    webHook: async (req, res) => {
        const fetchData = fetchDataWebHook_1.listDataFetchWebhook;
        await (0, webHookQueue_1.default)(fetchData);
        res.status(201).json({ message: "Success shook" });
        return;
    },
};
const generateToken = (data) => {
    const options = {
        expiresIn: "30d",
    };
    const token = jsonwebtoken_1.default.sign(data, process.env.JWT_SECRET, options);
    return token;
};
exports.generateToken = generateToken;
exports.default = SimService;
