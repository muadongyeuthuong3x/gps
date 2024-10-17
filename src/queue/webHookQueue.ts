import Queue from "bull";
import UserSchema from "../models/login.model";
import { FetchDataItem, SimCustom, SimQuota } from "../types/sim.nce";
import { getQuotaSim } from "./getAllSimAddData";
import SimSchema from "../models/sim.model";
import { banks } from "../enum";
import SimService from "../services/sim.service";

// Tạo queue
const taskQueue = new Queue("task queue");

taskQueue.process(1, async (job: any, done: any) => {
  const { token, fetchDataApi } = job.data;
  const quotaSim = await SimSchema.find({});
  const listSimCustom: SimCustom = {};
  if (quotaSim.length < 1) return;
  fetchDataApi.forEach((item: FetchDataItem) => {
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
      bank: "",
    };
    item.token_nce = token;
    if (listSimCustom[bank] !== undefined && listSimCustom[bank].length > 1) {
      const simsA: string[] = [];
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
});

const enqueueTasks = async (dataProps: FetchDataItem[] ) => {
    console.log(dataProps)
  if(dataProps.length < 1) return;
  const data = await UserSchema.findOne();
  const { token_nce: token } = data;
  await taskQueue.add({ token , fetchDataApi : dataProps });
  console.log(`Job for  completed.`);
};

export default enqueueTasks;
