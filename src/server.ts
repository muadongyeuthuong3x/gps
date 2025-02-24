import express from "express";
require("dotenv").config();
import cors from 'cors';
import morgan from "morgan";
import fs from "fs";
import path from "path";
import Database from "./database/db";
import corsConfig from "./cors/serverCors";
import router from "./routers/router";
import scheduleJob  from "./queue/getAllSimAddData";
import cron from 'node-cron'
import newSimQueueProcess from "./queue/newSimSave"

const app = express();

app.use(cors(corsConfig));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "winston/logger/loggerRequest.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  morgan((tokens, req, res) => {
    const timestamp = new Date().toISOString();
    return [
      timestamp,
      "-",
      tokens.method(req, res),
      "-",
      tokens.url(req, res),
      "-",
      tokens.status(req, res),
      "-",
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);

const PORT = process.env.PORT || 3000;
const URL = process.env.MONGODB_URL ?? "";
console.log(2222222222222, PORT , URL)

//*/5 * * * *
cron.schedule('*/30 * * * * *', async () => {
  await scheduleJob();
});

// Chạy newSimQueueProcess mỗi 15 giây
cron.schedule('*/15 * * * * *', async () => {
  await newSimQueueProcess();
});

app.use(express.json());
app.use('/api', router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  const db = Database.getInstance();
  await db.connect(URL);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer().catch(error => {
  console.error("Error starting server:", error);
});