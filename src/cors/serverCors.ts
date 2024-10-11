require("dotenv").config();

const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

export default corsConfig;
