import { fetchData } from "../fetchApi/fetchData";
import UserSchema from "../models/login.model";
import SimSchema from "../models/sim.model";
import { SimQuota } from "../types/sim.nce";
import Queue from "bull";

const newSimQueue = new Queue("new sim", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Xử lý job trong queue
newSimQueue.process(async (job: any, done: any) => {
  try {
    const { token } = job.data;
    const getAllSim = await SimSchema.find({});
    const lengthAllSim = getAllSim.length;
    const listSimNew: string[] = [];
    const fetchDataApi = fetchData;
    fetchDataApi.forEach((item) => {
      const { iccid } = item;
      if (lengthAllSim < 1) {
        listSimNew.push(iccid);
      } else {
        const listIccid = getAllSim.map((item: SimQuota) => item.iccid);
        if (!listIccid.includes(iccid)) {
          listSimNew.push(iccid);
        }
      }
    });
    const newSims = listSimNew.map((simNew) => ({ iccid: simNew }));
    await SimSchema.insertMany(newSims);
    done();
  } catch (error) {
    console.error("Error processing job:", error);
    done(new Error("Job failed"));
  }
});


const newSimQueueProcess = async () => {
  const data = await UserSchema.findOne({});
  const { token_nce: token } = data;
  await newSimQueue.add({ token });
};

export default newSimQueueProcess;
