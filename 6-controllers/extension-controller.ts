import express from "express";
import jwt_decode from "jwt-decode";
import { UserModel } from "../4-models/UserModel";
import { getUserIdByEmail, Register } from "../5-logic/auth-logic";
import { saveWordstoUser, translateText } from "../5-logic/extenstion-logic";

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
  
// extenstionRouter.post('/saveWordromExtenstion', async (req, res, next) => {
//   try {

//     const { hebrewWord, englishWord, email } = req.body;

//      const userId = await getUserIdByEmail(email);
//     if(userId) {
//       // saveWordstoUser(userId,hebrewWord, englishWord )
//     } else {
//       // register a new user then do it again
//     }
//     // const result = await Register(user.email);
//     // console.log(`Registration result: ${JSON.stringify(result)}`);
//     res.json(hebrewWord).status(200);
//   } catch (e) {
//     console.log(`Error: ${e.message}`);
//     res.status(500).send(`Failed to save the word: ${e.message}`);
//   }
// });
  
extenstionRouter.post('/saveWordromExtenstion', async (req, res, next) => {
  console.log("test");
  
  try {
    const { hebrewWord, englishWord, email } = req.body;
    let userId = await getUserIdByEmail(email);

    if (!userId) {
      const newUser = await Register(email);
      if(newUser){
        userId = await getUserIdByEmail(email);
      }
    }


    await saveWordstoUser(userId, hebrewWord, englishWord);
    res.json({ message: 'Word saved successfully.' }).status(200);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    res.status(500).send(`Failed to save the word: ${e.message}`);
  }
});