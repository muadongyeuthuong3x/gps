import Queue from "bull";
import axios from "axios";
import { listDataFetch } from "../fetchApi/fetchData";
import winstonLogger from "../winston/winstonLogger";
import SimSchema from "../models/sim.model";
import SimService, { SimsVolumn } from "../services/sim.service";
import { FetchDataItem, SimCustom, SimQuota } from "../types/sim.nce";
import UserSchema from "../models/login.model";
import { banks } from "../enum";

const getAllSimQueue = new Queue("all sim queue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});



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
    const fetchDataApi : FetchDataItem[] = listDataFetch as FetchDataItem[];
    const quotaSim = await SimSchema.find({});
    const listSimCustom : SimCustom = {};
    if (quotaSim.length < 1) return;
    fetchDataApi.forEach((item) => {
      const checkAddQouta: SimQuota = getQuotaSim(item, quotaSim) as SimQuota;
      if (JSON.stringify(checkAddQouta) !== "{}") {
        const { bank } = checkAddQouta;
        if (!listSimCustom[bank]) {
          listSimCustom[bank] = []; 
        } 
        listSimCustom[bank].push(checkAddQouta);
      }
    });
     
    for (const bank of banks) {
      const item: any = {
        sims: [],
        bank: ""
      };
      item.token_nce = token;
      if ( listSimCustom[bank] !== undefined && listSimCustom[bank].length > 1) {
        const simsA : string[ ] = [];
        listSimCustom[bank].map((e: SimQuota) => {
          const { iccid } = e;
          simsA.push(iccid);
        });
        item.bank = bank;
        item.sims = simsA;
        await SimService.addVolumeInSims(item);
      }

    }
    done(); 
  } catch (error) {
    winstonLogger.error("Error job getInformation all SIm:", error);
    done(new Error("Job failed"));
  }
});


export const getQuotaSim = (item: FetchDataItem, quotaSim: SimQuota[]) => {
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
  }


const scheduleJob = async () => {
  const data = await UserSchema.findOne({});
  const { token_nce: token } = data;
  await getAllSimQueue.add({ token });
};

export default scheduleJob;

