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

