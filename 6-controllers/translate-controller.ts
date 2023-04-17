import express from "express";
import { saveSelectedWordByUser, Test } from "../5-logic/translate-logic";

export const TranslateRouter = express.Router();

TranslateRouter.post('/saveWord', async (req, res, next) => {
  try {
    const { word, translateWord } = req.body;

    await saveSelectedWordByUser(word, translateWord)

    res.json(translateWord).status(200);
    
  } catch(e){
    console.log(e);
  }
});
  
  
TranslateRouter.get('/test', async (req, res, next) => {
    Test()
    res.json("test").status(200);
  });
  
  
  
  
  
