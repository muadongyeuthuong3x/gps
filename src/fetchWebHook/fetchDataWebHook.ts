import { dataFetch, numbersArray } from "../fetchApi/fetchData";
import { FetchDataItem } from "../types/sim.nce";

const listDataFetchWebhook : FetchDataItem[] = [];

for (let i = 0; i < 10; i++) {
    dataFetch.imsi = numbersArray[1];
    dataFetch.current_quota = Math.floor(Math.random() * 20) + 1;
    dataFetch.current_quota_SMS = Math.floor(Math.random() * 20) + 1;
    listDataFetchWebhook.push(dataFetch);
  }
  
  export { listDataFetchWebhook };