import Queue from "bull";
import axios from "axios";
import { fetchData } from "../fetchApi/fetchData";
import winstonLogger from "../winston/winstonLogger";
import SimSchema from "../models/sim.model";
import SimService from "../services/sim.service";
import { FetchDataItem, SimQuota } from "../types/sim.nce";

const getAllSimQueue = new Queue("allSimQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});



interface simCustom  {
  [quota: string] : string[];
}


getAllSimQueue.process(async (job) => {
  const token = job.data.token;
  console.log(token);
  try {
    const options = {
      method: "GET",
      url: process.env.NCE_TOKEN,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axios(options);
    const fetchDataApi = fetchData;
    const quotaSim = await SimSchema.find({});
    const listSimCustom : simCustom = {};
    fetchDataApi.forEach((item) => {
      const checkAddQouta : simCustom | null = getQuotaSim(item, quotaSim);
      if (checkAddQouta) {
        const { quota , iccid } = checkAddQouta;
        if(!listSimCustom[quota]){
          listSimCustom[quota] = [];
        }else {
          listSimCustom[quota].push(iccid)
        }
    }});
    console.log(listSimCustom);
  } catch (error) {
    winstonLogger.error("Error job getInformation all SIm:", error);
  }
});

const getQuotaSim = (item : FetchDataItem , quotaSim : SimQuota[]) => {
  let addQuota = null;
  const { iccid: iccidGet, current_quota } = item;
  quotaSim.forEach((sim: SimQuota) => {
    const { quota, iccid } = sim;
    if (iccid == iccidGet) {
      if (current_quota < quota) {
        addQuota = true;
        addQuota = {
        [quota] : iccid
        }
      }
    }
  });
  return addQuota;
};




const scheduleJob = async (token : string) => {
  getAllSimQueue.add({ token }, { repeat: { every: 30000 } });
};

export default scheduleJob;

