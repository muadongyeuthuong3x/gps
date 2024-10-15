import Queue from "bull";
import axios from "axios";
import { fetchData } from "../fetchApi/fetchData";
import winstonLogger from "../winston/winstonLogger";
import SimSchema from "../models/sim.model";
import SimService, { SimsVolumn } from "../services/sim.service";
import { FetchDataItem, SimQuota } from "../types/sim.nce";
import UserSchema from "../models/login.model";

const getAllSimQueue = new Queue("all sim queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});



interface simCustom  {
  [quota: string] : SimQuota[];
}


getAllSimQueue.process(async (job: any, done: any) => {

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
    const fetchDataApi = fetchData;
    const quotaSim = await SimSchema.find({});
    const listSimCustom : simCustom = {};
    fetchDataApi.forEach((item) => {
      const checkAddQouta : SimQuota   = getQuotaSim(item, quotaSim) as SimQuota;
      if (checkAddQouta) {
        const { quota  } = checkAddQouta;
        if(!listSimCustom[quota]){
          listSimCustom[quota] = [];
        }else {
          listSimCustom.quota.push(checkAddQouta)
        }
    }});
    const valuesArray  = Object.values(listSimCustom) as unknown as SimsVolumn[];
    for (const item of valuesArray) {
       item.token_nce = token;
       await SimService.addVolumeInSims(item);
    }
    done(); 
  } catch (error) {
    winstonLogger.error("Error job getInformation all SIm:", error);
    done(new Error("Job failed"));
  }
});

const getQuotaSim = (item : FetchDataItem , quotaSim : SimQuota[]) => {
  let addQuota = {};
  const { iccid: iccidGet, current_quota } = item;
  quotaSim.forEach((sim: SimQuota) => {
    const { quota, iccid } = sim;
    if (iccid == iccidGet) {
      if (current_quota < quota) {
        addQuota = sim;
      }
    }
  });
  return addQuota;
};




const scheduleJob = async () => {
  const data = await UserSchema.findOne({});
  const { token_nce: token } = data;
  await getAllSimQueue.add({ token });
};

export default scheduleJob;

