import express from 'express'
import { UserModel } from '../4-models/UserModel';
import { deleteMessagesByUserId, getMessageFromChatGPTandSave, getMessagesByUserId, saveUserMessage } from '../5-logic/messages-logic';
import jwt_decode from "jwt-decode";
import { getUserIdByEmail } from '../5-logic/auth-logic';

export const MessagesRoute = express.Router();



MessagesRoute.get('/getChatConversation', async (req, res) => {
    
    try {
        const token = req.headers.authorization; 
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const user : UserModel = jwt_decode(token);
        const userId = await getUserIdByEmail(user.email);

        const results = await getMessagesByUserId(+userId);
        
        if (results.length === 0) {
            res.status(200).json([])
            return;
        } else {
            res.status(200).json(results)
        }
    } catch (e) {
        res.status(404).json(e);
    }
})


MessagesRoute.delete('/deleteChatMessages', async (req, res) => {
    
    try {
        const token = req.headers.authorization; 
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const user : UserModel = jwt_decode(token);
        const userId = await getUserIdByEmail(user.email);

        const results = await deleteMessagesByUserId(+userId);
        
        if (results.length === 0) {
            res.status(200).json([])
            return;
        } else {
            res.status(200).json(results)
        }
    } catch (e) {
        res.status(404).json(e);
    }
})

MessagesRoute.post('/newMessage', async (req, res) => {
    const message = req.body.message
    try {
        const token = req.headers.authorization; 
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        const user : UserModel = jwt_decode(token);
        const userId = await getUserIdByEmail(user.email);

            await saveUserMessage(message, userId);
            const chatGptResults = await getMessageFromChatGPTandSave(userId);
            res.status(200).json(chatGptResults);
            return;

    } catch (e) {
        res.status(401).json(e)
    }
})