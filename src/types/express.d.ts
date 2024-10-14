import * as express from 'express';

interface User {
    username: string;
    token_nce: string;
  }

  declare module "express-serve-static-core" {
    interface Request {
      user?: User; // Make user optional
    }
  }