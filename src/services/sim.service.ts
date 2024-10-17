import { Request, Response } from "express";
import loginSchema from "../validator/login.validator";
import UserSchema from "../models/login.model";
import winstonLogger from "../winston/winstonLogger";
import { banks } from "../enum";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { User } from "../types/express";
import { listDataFetchWebhook } from "../fetchWebHook/fetchDataWebHook";
import enqueueTasks from "../queue/webHookQueue";

interface Login {
  username: string;
  password: string;
}

export interface SimsVolumn {
  sims: string[];
  bank: string;
  token_nce: string;
}

const saltRounds = 10;

const SimService = {
  saveInformationSim: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as Login;
    const { error } = loginSchema.validate({ username, password });

    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    try {
      const checkExistUser = await UserSchema.findOne({ username });
      if (checkExistUser) {
        const { token_nce } = checkExistUser;
        if (!token_nce) {
          res.status(404).json({ message: "You no setting data nce" });
          return;
        }
        res.status(404).json({ message: "User exists in database" });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
     

      // Uncomment and implement this block if needed
      /*
      const options = {
        method: "POST",
        url: process.env.NCE_TOKEN,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Basic ${user_infor_base64}`,
        },
        data: {
          grant_type: "client_credentials",
        },
      };

      const response = await axios(options);
      getToken1NCE = response.data; // Ensure you're getting the token correctly
      */
      const user_infor_base64 = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      let getToken1NCE = user_infor_base64;
      const newUser = new UserSchema({
        username,
        password: hashedPassword,
        user_infor_base64,
        token_nce: getToken1NCE,
      });

      await newUser.save();
      const token = generateToken({ username, token_nce: getToken1NCE });
      res.status(201).json({ message: "Success", token });
    } catch (error) {
      winstonLogger.error("Error saving user information:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addVolumeInSims: async (data: any): Promise<void> => {
    const { sims, bank, token_nce } = data;
    if (!banks.includes(bank)) {
      winstonLogger.error("addVolumeInSims errors : Bank not found");
    }

    try {
      const options = {
        method: "OPTIONS",
        url: `${process.env.NCE_TOKEN}/topup?payment_method=${bank}`,
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token_nce}`,
          "content-type": "application/json",
        },
        data: sims,
      };
      const response = await axios(options);
      winstonLogger.info("addVolumeInSims success :", { sims, bank });
    } catch (error) {
      winstonLogger.error("volumn :", error);
    }
  },
  loginWeb: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as Login;
    try {
      const data = await UserSchema.findOne({ username }).select(
        "username password token_nce"
      );
      if (!data) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const { password: passwordDb, token_nce } = data;
      const isMatch = await bcrypt.compare(password, passwordDb);
      if (!isMatch) {
        res.status(404).json({ message: "Password not found" });
        return;
      }
      const token = generateToken({ username, token_nce });
      res.json({ token });
      return;
    } catch (error) {
      winstonLogger.error("Login:", error);
      res.status(500).json({ message: error });
      return;
    }
  },

  webHook: async (req: Request, res: Response): Promise<void> => {
   const fetchData = listDataFetchWebhook;
   await enqueueTasks(fetchData);
   res.status(201).json({ message: "Success hook"});
   return; 
  }
};

export const generateToken = (data: User) => {
  const options = {
    expiresIn: "30d",
  };
  const token = jwt.sign(data, process.env.JWT_SECRET as string, options);
  return token;
};

export default SimService;
