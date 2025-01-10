"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDataFetchWebhook = void 0;
const fetchData_1 = require("../fetchApi/fetchData");
const listDataFetchWebhook = [];
exports.listDataFetchWebhook = listDataFetchWebhook;
for (let i = 0; i < 10; i++) {
    fetchData_1.dataFetch.imsi = fetchData_1.numbersArray[1];
    fetchData_1.dataFetch.current_quota = Math.floor(Math.random() * 20) + 1;
    fetchData_1.dataFetch.current_quota_SMS = Math.floor(Math.random() * 20) + 1;
    listDataFetchWebhook.push(fetchData_1.dataFetch);
}
