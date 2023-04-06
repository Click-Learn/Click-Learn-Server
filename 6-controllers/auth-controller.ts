import express from "express";

export const authRouter = express.Router();
  
authRouter.get('/test', async (req, res, next) => {
    res.json("test").status(200);
  });
  
  
  
  
  
