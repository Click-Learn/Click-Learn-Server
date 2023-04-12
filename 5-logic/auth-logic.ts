import { execute } from "../2-utils/dal";
import { UserModel } from "../4-models/UserModel";

export async function getUserIdByEmail(email: string) {
    
    const query = "SELECT * FROM clicklearn.users WHERE email = ?;";
    const [rows] = await execute<UserModel>(query, [email]);
    
    return rows[0].id
}


export async function Register(email: string): Promise<boolean> {
    const [existingUser] = await execute<UserModel>("SELECT * FROM users WHERE email = ?", [email]);
  
    if (existingUser) {
      return false;
    }
    
    const query = "INSERT INTO clicklearn.users (email) VALUES (?);";
    const result = await execute(query, [email]);
    return true;
  }