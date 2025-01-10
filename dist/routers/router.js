"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sim_service_1 = __importDefault(require("./../services/sim.service"));
const router = (0, express_1.Router)();
router.post('/register-information-1nce', sim_service_1.default.saveInformationSim);
// router.post('/add-volumn', authenticateToken , SimService.addVolumeInSims);
router.post('/login', sim_service_1.default.loginWeb);
router.get('/get', sim_service_1.default.getInformation);
router.post('/weeb-hook', sim_service_1.default.webHook);
exports.default = router;
