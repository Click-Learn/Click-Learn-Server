import axios from "axios";
import { execute } from "../2-utils/dal";
import { WordModel } from '../4-models/WordsModel';

export async function translateText(text) {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
    const sourceLanguage = 'en';
    const targetLanguage = 'he';
  
    try {
      const response = await axios.post(`${apiUrl}?key=${apiKey}`, {
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      }, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
      
      console.log(response.data.data.translations[0].translatedText);
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      throw new Error('Translation API request failed');
    }

    // return "שלום"
  }

  export async function saveWordstoUser(userId: number, hebrewWord: string, englishWord: string) {
    const query = "SELECT * FROM clicklearn.words WHERE userId = ? and englishWord = ?;";
    const [rows] = await execute<WordModel>(query, [userId, englishWord]);
    if(rows.length === 0){
      try{
        
        const query = "INSERT INTO clicklearn.words (userId, hebrewWord, englishWord) VALUES (?, ?, ?);";
        const [rows] = await execute<WordModel>(query, [userId, hebrewWord, englishWord]);
        return rows
      } catch(e) {
        return {word: englishWord,error: "duplicate"};
        
      }
    } else {
      
      return {word: englishWord,error: "duplicate"};
    }
  }
