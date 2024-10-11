import { Request, Response } from "express";
import loginSchema from "../validator/login.validator";
import UserSchema from "../models/login.model";
import winstonLogger from "../winston/winstonLogger";
import axios from "axios";

interface Login {
  username: string;
  password: string;
}
const SimService = {
  saveInformationSim: async (req: Request, res: Response) => {
    const { username, password } = req.body as Login;
    const { error } = loginSchema.validate({ username, password });
    if (error) {
      return res.status(400).json({ mesage: error.details[0].message });
    }
    try {
      const checkExistUser = await UserSchema.findOne({ username });
      if (checkExistUser) {
        return res.status(404).json({ message: "User exist database" });
      }

      const user_infor_base64 = Buffer.from(`${username}:${password}`).toString(
        "base64"
      );
      let getToken1NCE = "";

      // const options = {
      //   method: "POST",
      //   url: process.env.NCE_TOKEN,
      //   headers: {
      //     accept: "application/json",
      //     "content-type": "application/json",
      //     authorization: `Basic ${user_infor_base64}`,
      //   },
      //   data: {
      //     grant_type: "client_credentials",
      //   },
      // };

      // axios(options).then((response) => {
      //   getToken1NCE = response.data;
      // });
       
      const newUser = new UserSchema();
      newUser.username = username;
      newUser.password = password;
      newUser.user_infor_base64 = user_infor_base64;
      newUser.token = getToken1NCE;
      await newUser.save();
      return res.status(201).json({ message : "Success"})
      

    } catch (error) {
      winstonLogger.error("Erorr information user:", error);
    }
  },
};

export default SimService;
