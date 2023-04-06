import express from "express";

export const TranslateRouter = express.Router();

TranslateRouter.post('/translateToHe', async (req, res, next) => {
    res.json("test").status(200);
  });
  
  
TranslateRouter.get('/test', async (req, res, next) => {
    res.json("test").status(200);
  });
  
  
  
  
  
