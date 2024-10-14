import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types/express";

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({message : "errror user"});
    return;
  }

  jwt.verify(token as string, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(403).json({ message : "error server"});
      return;
    }
    req.user = user as User;
    next();
  });
};

export default authenticateToken;
