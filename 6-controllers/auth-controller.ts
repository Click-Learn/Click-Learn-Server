import express from "express";
import jwt_decode from "jwt-decode";
import { UserModel } from "../4-models/UserModel";
import { Register } from "../5-logic/auth-logic";

export const authRouter = express.Router();


// authRouter.post('/register', async (req, res, next) => {
//   try {
//     const token = req.headers.authorization; 
//     // const token = req.body.token;
//     // console.log(req.body);

//     console.log(token);
//     const user : UserModel = jwt_decode(token);
//     const registered = await Register(user.email);

//     if (!registered) {
//       throw new Error(`User with email '${user.email}' already exists`);
//     }

//     res.json({ success: true }).status(200);
//   } catch(e){
//     console.log(e);
//     throw new Error('Failed to register user');
//   }
// });
  
  
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
  
