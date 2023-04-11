import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai";
import { execute } from '../2-utils/dal';
import { ArticleModel } from '../4-models/ArticleMode';
import { WordModel } from '../4-models/WordsModel';
dotenv.config({ path: ".env" });

export async function getWordsByUser(userId: number) {
    const query = "SELECT * FROM clicklearn.words WHERE userId = ?;";
    const [rows] = await execute<WordModel[]>(query, [userId]);
    
    return rows
}

export async function getFavoriteWordsByUser(userId: number) {
    const query = "SELECT * FROM clicklearn.words WHERE userId = ? and favorite = 1;";
    const [rows] = await execute<WordModel[]>(query, [userId]);
    return rows
}

export async function getArticlesByUser(userId: number) {
    const query = "SELECT * FROM clicklearn.articles WHERE userId = ?;";
    const [rows] = await execute<ArticleModel[]>(query, [userId]);
    return rows
}

export async function getArticleByIdByUser(userId: number, id: number) {
    const query = "SELECT * FROM clicklearn.articles WHERE userId = ? and id = ?;";
    const [rows] = await execute<ArticleModel>(query, [userId, id]);
    return rows
}


