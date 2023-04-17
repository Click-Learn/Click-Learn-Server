import express from "express";
import jwt_decode from "jwt-decode";
import { UserModel } from "../4-models/UserModel";
import { Register, Subscribe } from "../5-logic/auth-logic";

export const authRouter = express.Router();

authRouter.post('/register', async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user: UserModel = jwt_decode(token);
    const result = await Register(user.email);
    console.log(`Registration result: ${JSON.stringify(result)}`);
    res.json(result).status(200);
  } catch (e) {
    console.log(`Error: ${e.message}`);
    res.status(500).send(`Failed to register user: ${e.message}`);
  }
});

authRouter.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // send to function to push the email into db
    const sub = await Subscribe(email);
    // if (sub === "duplicate") {
    //   return res.json("duplicate").status(403);
    // }

    res.status(200).json({ email: email });
  } catch (e) {
    console.log(`Error: ${e.message}`);
    res.status(500).send(`Failed to register user: ${e.message}`);
  }
});


  
