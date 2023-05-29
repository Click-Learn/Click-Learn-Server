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
export async function getLast10MessagesByUserId(userId: number): Promise<any> {    
    
    const query = `SELECT * FROM (SELECT * FROM messages WHERE userId = ? ORDER BY timestamp DESC LIMIT 10) subquery ORDER BY timestamp ASC;`;
    const [results]: any = await execute<OkPacket>(query, [userId]);
    return results;
}

export async function deleteMessagesByUserId(userId: number): Promise<any> {    
    const query = `DELETE FROM messages WHERE userId = ? AND id > 0;`;
    const [results]: any = await execute<OkPacket>(query, [userId]);
    return results;
}


import axios from 'axios';
import { getFavoriteWordsByUser } from "./words-articles";

export async function getMessageFromChatGPTandSave(userId: number) {

  const history = await getLast10MessagesByUserId(userId);
  const favoriteWords = await getFavoriteWordsByUser(userId)
  const favoriteEnglishWords = favoriteWords.map((item) => item.englishWord);

  console.log(favoriteWords);
  
  const messages = [];
  messages.push({ role: 'system', content: "You're an English tutor for a Hebrew-speaking user learning English. Your primary task is to correct any spelling or grammatical errors in the user's responses. Always begin your response with a corrected version of the user's sentence, if necessary. Then provide a short, concise reply and ask another question to maintain conversational flow. Use the user's favorite English words where appropriate. Remember, your main role is to help the user improve their English skills. and this is my favorite words:" + favoriteEnglishWords });

  for (const msg of history) {
    if (msg.role === 0) {
      messages.push({ role: 'assistant', content: msg.message });
    } else if (msg.role === 1) {
      messages.push({ role: 'user', content: msg.message });
    }
  }
  // console.log(history);

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
