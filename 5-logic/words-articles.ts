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
    
    export async function saveArticleToUser(userId: number, newArticle: string) {
  try {
    console.log("here all article" + newArticle)

    const titleStart = newArticle.indexOf('"articleTitle": "') + 17;
    const articleTitle = newArticle.substring(titleStart, newArticle.indexOf('"', titleStart));
    const contentStart = newArticle.indexOf('"article": "') + 12;
    const article = newArticle.substring(contentStart, newArticle.indexOf('"', contentStart));
    const articleObj = {
      articleTitle,
      article
    };
    console.log(articleObj);
    
    const query = "INSERT INTO articles (userId, article, articleTitle) VALUES (?, ?, ?);";
    const [rows] = await execute<WordModel>(query, [userId, article, articleTitle]);
    return articleObj;
  } catch (e) {
    console.log(e);
    return "";
  }
}


// export async function createNewArticleByFavoriteWords(userId: number): Promise<string> {
export async function createNewArticleByFavoriteWords(userId: number) {
  const userFavoriteWords = await getFavoriteWordsByUser(userId);
  console.log({userFavoriteWords});
  const englishWords = userFavoriteWords.map((item) => item.englishWord);
  console.log(englishWords);


  const requestData = {
    "model": "gpt-3.5-turbo",
    // "messages": [{"role": "user", "content": "Say this is a test!"}],
    "messages": [{"role":"user","content": ` ${"Please act as an English teacher. My native language is Hebrew. Write a short article, not exceeding 180 words, using the following words from the user's list: " + englishWords + "Include a title for the article. Please provide the output in PURE!! JSON format WITHOUT ANY bad control character!(keys must to be: articleTitle, article) without any introductions or additions beyond the 180-word limit"}` }],

    "temperature": 0.7
  };
  
  const response = await axios.post('https://api.openai.com/v1/chat/completions', requestData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });
  const row = saveArticleToUser(userId, response.data.choices[0].message.content)
  return row;
    // .then(response => console.log(response.data.choices[0].message.content))
    // .catch(error => console.error(error));
  
  
  // // const userFavoriteWords = ["blue", "red", "yellow", "white"]
  // const options: any = {
  //   method: 'POST',
  //   url: 'https://openai80.p.rapidapi.com/chat/completions',
  //   headers: {
  //     'content-type': 'application/json',
  //     'X-RapidAPI-Key': 'a25b14b356msh79c657e7a0d486bp12f5bdjsncefabef81856',
  //   },
  //   // data: '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"' + "please act as english teacher ,My native language is Hebrew. please write for me A short essay using the following words. words =" + userFavoriteWords + "please write maximum 10 words only the essay No introductions or additions with maximum 10 words" +'"}]}'
    // data: '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"' + "Please act as an English teacher. My native language is Hebrew. Write a short article, not exceeding 180 words, using the following words from the user's list: " + englishWords + "Include a title for the article. Please provide the output in JSON format(keys must to be: articleTitle, article) without any introductions or additions beyond the 180-word limit" +'"}]}'
  // };

  // return new Promise((resolve, reject) => {
  //   axios.request(options).then(function (response) {
  //     const content = response.data.choices[0].message.content;
  //     // console.log(content);
  //     const row = saveArticleToUser(userId, response.data.choices[0].message.content)
  //     resolve(content);
  //     return row;
  //   }).catch(function (error) {
  //     console.error(error);
  //     reject(error);
  //   });
  // });
}


// createNewArticleByFavoriteWords()



// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// const completion = await openai.createCompletion({
//   model: "gpt-3.5-turbo",
//   prompt: "Hello world",
// });
// console.log(completion.data.choices[0].text);

// import { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//     organization: "org-2yA2UYvhW4Hsk7JDTDHkhGB2",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // replace with your actual API key

