import * as dotenv from 'dotenv'
import { OkPacket } from 'mysql2';
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
    const query = "SELECT * FROM clicklearn.articles WHERE userId = ?";
    const [rows] = await execute<ArticleModel[]>(query, [userId]);
    return rows
}

export async function getArticleByIdByUser(userId: number, id: number) {
    const query = "SELECT * FROM clicklearn.articles WHERE userId = ? and id = ?";
    const [rows] = await execute<ArticleModel>(query, [userId, id]);
    return rows
}



export async function favoriteToWord(wordId: number, userId: number) {
    const query = "UPDATE clicklearn.words SET favorite = 1 WHERE id = ? AND userId = ?;";
    const [rows] = await execute<ArticleModel>(query, [wordId, userId]);
    return rows
}

export async function unFavoriteToWord(wordId: number, userId: number) {
    const query = "UPDATE clicklearn.words SET favorite = 0 WHERE id = ? AND userId = ?;";
    const [rows] = await execute<ArticleModel>(query, [wordId, userId]);
    return rows
}



export async function deleteWord(wordId: number, userId: number) {
  const query = "DELETE FROM clicklearn.words WHERE id = ? AND userId = ?;";
  const [rows] = await execute<OkPacket>(query, [wordId, userId]);
  return rows
}


export async function getAllWordsBank() {
  const query = "SELECT * FROM clicklearn.wordsbank ORDER BY RAND() LIMIT 20;";
  const [rows] = await execute<WordModel[]>(query, []);
  return rows
}

export async function addWordToUser(userId: number, hebrewWord: string, englishWord: string) {

  try{

    const query = "INSERT INTO clicklearn.words (userId, hebrewWord, englishWord) VALUES (?, ?, ?);";
    const [rows] = await execute<WordModel>(query, [userId, hebrewWord, englishWord]);
    return rows
  } catch(e) {
    return {word: englishWord,error: "duplicate"};
    
  }
}
