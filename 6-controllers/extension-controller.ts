import express from "express";
import jwt_decode from "jwt-decode";
import { UserModel } from "../4-models/UserModel";
import { translateText } from "../5-logic/extenstion-logic";

export const extenstionRouter = express.Router();


extenstionRouter.post('/translateTheWord', async (req, res, next) => {
  try {
    // const token = req.headers.authorization;
    // const user: UserModel = jwt_decode(token);הןה

    const { word } = req.body;
    const hebrewWord = await translateText(word);

    // const result = await Register(user.email);
    // console.log(`Registration result: ${JSON.stringify(result)}`);
    res.json(hebrewWord).status(200);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    res.status(500).send(`Failed to tranlsate the word: ${e.message}`);
  }
});
  
