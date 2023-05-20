import { OkPacket } from "mysql2"
import { execute } from "../2-utils/dal";

export async function saveUserMessage(message: string, userId: number) {
    const timeStamp = new Date().getTime()
    const query = 'INSERT INTO messages(message,role,timestamp,userId) VALUES(?,?,?,?)'
    await execute<OkPacket>(query, [message, 1, timeStamp, userId]);
}

export async function getMessagesByUserId(userId: number): Promise<any> {    
    
    const query = `SELECT * FROM messages WHERE userId = ? ORDER BY timestamp ASC`;
    const [results]: any = await execute<OkPacket>(query, [userId]);
    return results;
}





// export async function getMessageFromChatGPTandSave(message: string, userId: number) {
//     const history = await getMessagesByUserId(userId);

//     const messages = [];
//     messages.push({ role: 'system', content: 'you are a helpful assistant' })

//     for (const msg of history) {
//         if (msg.role === 0) {
//             messages.push({ role: 'assistant', content: msg.message });
//         } else if (msg.role === 1) {
//             messages.push({ role: 'user', content: msg.message });
//         }
//     }
//     console.log(history);
    

//     try {
//         const completion: any = openai.createChatCompletion({
//             model: 'gpt-3.5-turbo',
//             messages: messages
//         })
//         let { data } = await completion
//         const reply = data.choices[0].message.content;
//         const timeStamp = new Date().getTime();
//         const query = 'INSERT INTO messages(message,role,timestamp,userId,roomId) VALUES(?,?,?,?,?)'
//         const res = await execute<OkPacket>(query, [reply, 0, timeStamp, +id, roomId]);
//         return reply
//     } catch (e) {
//         return 'There has been an error, try again'
//     }
// }

import axios from 'axios';

export async function getMessageFromChatGPTandSave(userId: number) {
  const history = await getMessagesByUserId(userId);

  const messages = [];
  messages.push({ role: 'system', content: 'you are a helpful assistant' });

  for (const msg of history) {
    if (msg.role === 0) {
      messages.push({ role: 'assistant', content: msg.message });
    } else if (msg.role === 1) {
      messages.push({ role: 'user', content: msg.message });
    }
  }
  console.log(history);

  try {
    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: messages,
    };

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    const timeStamp = new Date().getTime();
    const query =
      'INSERT INTO messages(message,role,timestamp,userId) VALUES(?,?,?,?)';
    const res = await execute<OkPacket>(query, [reply, 0, timeStamp, +userId]);
    return reply;
  } catch (e) {
    return 'There has been an error, try again';
  }
}
