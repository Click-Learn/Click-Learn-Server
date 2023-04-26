import * as dotenv from 'dotenv'
import { OkPacket } from 'mysql2';
import { execute } from '../2-utils/dal';
import { ArticleModel } from '../4-models/ArticleMode';
import { WordModel } from '../4-models/WordsModel';
import axios from 'axios';
dotenv.config({ path: ".env" });

export async function getWordsByUser(userId: number) {
    const query = "SELECT * FROM words WHERE userId = ?;";
    const [rows] = await execute<WordModel[]>(query, [userId]);
    
    return rows
}

export async function getFavoriteWordsByUser(userId: number) {
    const query = "SELECT * FROM words WHERE userId = ? and favorite = 1;";
    const [rows] = await execute<WordModel[]>(query, [userId]);
    return rows
}

export async function getArticlesByUser(userId: number) {
    const query = "SELECT * FROM articles WHERE userId = ?";
    const [rows] = await execute<ArticleModel[]>(query, [userId]);
    return rows
}

export async function getArticleByIdByUser(userId: number, id: number) {
    const query = "SELECT * FROM articles WHERE userId = ? and id = ?";
    const [rows] = await execute<ArticleModel>(query, [userId, id]);
    return rows
}



export async function favoriteToWord(wordId: number, userId: number) {
    const query = "UPDATE words SET favorite = 1 WHERE id = ? AND userId = ?;";
    const [rows] = await execute<ArticleModel>(query, [wordId, userId]);
    return rows
}

export async function unFavoriteToWord(wordId: number, userId: number) {
    const query = "UPDATE words SET favorite = 0 WHERE id = ? AND userId = ?;";
    const [rows] = await execute<ArticleModel>(query, [wordId, userId]);
    return rows
}



export async function deleteArticle(articleId: number, userId: number) {
  const query = "DELETE FROM articles WHERE id = ? AND userId = ?;";
  const [rows] = await execute<OkPacket>(query, [articleId, userId]);
  return rows
}


export async function deleteWord(wordId: number, userId: number) {
  const query = "DELETE FROM words WHERE id = ? AND userId = ?;";
  const [rows] = await execute<OkPacket>(query, [wordId, userId]);
  return rows
}


export async function getAllWordsBank() {
  const query = "SELECT * FROM wordsbank ORDER BY RAND() LIMIT 20;";
  const [rows] = await execute<WordModel[]>(query, []);
  return rows
}

export async function addWordToUser(userId: number, hebrewWord: string, englishWord: string) {
// check if user already saved the word
    const query = "SELECT * FROM words WHERE userId = ? and englishWord = ?;";
    const [rows] = await execute<WordModel>(query, [userId, englishWord]);
    if(rows.length === 0){
      try{
        
        const query = "INSERT INTO words (userId, hebrewWord, englishWord) VALUES (?, ?, ?);";
        const [rows] = await execute<WordModel>(query, [userId, hebrewWord, englishWord]);
        return rows
      } catch(e) {
        return {word: englishWord,error: "duplicate"};
        
      }
    } else {
      
      return {word: englishWord,error: "duplicate"};
    }
    }
    
    export async function saveArticleToUser(userId: number, newArticle: any) {
  try {
    console.log("here all article" + newArticle)
    newArticle = JSON.parse(newArticle)
    const articleTitle = newArticle.articleTitle;
    const article = newArticle.article;
    console.log("here title" + articleTitle);
    console.log("here content" + article);
    
    const query = "INSERT INTO articles (userId, article, articleTitle) VALUES (?, ?, ?);";
    const [rows] = await execute<WordModel>(query, [userId, article, articleTitle]);
    return rows;
  } catch (e) {
    console.log(e);
    return "";
  }
}


export async function createNewArticleByFavoriteWords(userId: number): Promise<string> {
  const userFavoriteWords = await getFavoriteWordsByUser(userId);
  const englishWords = userFavoriteWords.map((item) => item.englishWord);
  console.log(englishWords);
  
  // const userFavoriteWords = ["blue", "red", "yellow", "white"]
  const options: any = {
    method: 'POST',
    url: 'https://openai80.p.rapidapi.com/chat/completions',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'a25b14b356msh79c657e7a0d486bp12f5bdjsncefabef81856',
      'X-RapidAPI-Host': 'openai80.p.rapidapi.com'
    },
    // data: '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"' + "please act as english teacher ,My native language is Hebrew. please write for me A short essay using the following words. words =" + userFavoriteWords + "please write maximum 10 words only the essay No introductions or additions with maximum 10 words" +'"}]}'
    data: '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"' + "Please act as an English teacher. My native language is Hebrew. Write a short article, not exceeding 180 words, using the following words from the user's list: " + englishWords + "Include a title for the article. Please provide the output in JSON format(keys must to be: articleTitle, article) without any introductions or additions beyond the 180-word limit" +'"}]}'
  };

  return new Promise((resolve, reject) => {
    axios.request(options).then(function (response) {
      const content = response.data.choices[0].message.content;
      // console.log(content);
      const row = saveArticleToUser(userId, response.data.choices[0].message.content)
      resolve(content);
      return row;
    }).catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}


// createNewArticleByFavoriteWords()