import Queue from "bull";
import axios from "axios";
import { fetchData } from "../fetchApi/fetchData";
import winstonLogger from "../winston/winstonLogger";
import SimSchema from "../models/sim.model";
import SimService from "../services/sim.service";
import { FetchDataItem, SimQuota } from "../types/sim.nce";
import Redis from "ioredis";

const redisClient = new Redis({
    host: "127.0.0.1",
    port: 6379,
  });
  
  redisClient.on("connect", () => {
    console.log("Connected to Redis successfully");
  });
  
  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });
  
const newSimQueue = new Queue("newSimQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

interface simCustom {
  [quota: string]: string[];
}

newSimQueue.process(async (job) => {
  const token = job.data.token;
  console.log(22121211 , job.data)
  // const options = {
  //   method: "GET",
  //   url: process.env.NCE_TOKEN,
  //   headers: {
  //     accept: "application/json",
  //     "content-type": "application/json",
  //     authorization: `Bearer ${token_nce}`,
  //   },
  // };
  // const response = await axios(options);
  const getAllSim = await SimSchema.find({});
  const lengthAllSim = getAllSim.length;
  const listSimNew: string[] = [];
  fetchData.forEach((item) => {
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
  return;
});

const scheduleJobNewSim = async (token: string) => {
  await newSimQueue.add({ token }, { repeat: { every: 300000 } });
  console.log("Scheduled newSim job every 5 minutes with token:", token);
  
  // Kiểm tra job đã lập lịch
  const repeatableJobs = await newSimQueue.getRepeatableJobs();
  console.log("Current repeatable jobs:", repeatableJobs);
};

export default scheduleJobNewSim;
