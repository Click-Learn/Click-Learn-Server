import { execute } from "../2-utils/dal";
import { UserModel } from "../4-models/UserModel";

export async function getUserIdByEmail(email: string) {
    
    const query = "SELECT * FROM clicklearn.users WHERE email = ?;";
    const [rows] = await execute<UserModel>(query, [email]);
    
    return rows[0].id
}