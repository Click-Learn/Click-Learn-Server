import express from "express";
import jwt_decode from "jwt-decode";
import { UserModel } from "../4-models/UserModel";
import { WordModel } from "../4-models/WordsModel";
import { getUserIdByEmail } from "../5-logic/auth-logic";
import { addWordToUser, deleteWord, favoriteToWord, getAllWordsBank, getArticleByIdByUser, getArticlesByUser, getFavoriteWordsByUser, getWordsByUser, unFavoriteToWord } from "../5-logic/words-articles";

export const wordsArticlesRoute = express.Router();
  
wordsArticlesRoute.get('/test', async (req, res, next) => {
    res.json("test").status(200);
  });
  
  
  // tested in postman completely
  wordsArticlesRoute.get('/words', async (req, res, next) => {
      const token = req.headers.authorization; 
      
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    const words: WordModel[] = await getWordsByUser(+userId)
    
    res.json(words).status(200);
});


// tested in postman completely
wordsArticlesRoute.get('/favorite-words', async (req, res, next) => {
    const token = req.headers.authorization; 

    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    const favoriteWords= await getFavoriteWordsByUser(+userId)
    res.json(favoriteWords).status(200);
});



// tested in postman completely
wordsArticlesRoute.get('/articles', async (req, res, next) => {
    const token = req.headers.authorization; 
    
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    const articles = await getArticlesByUser(+userId)
    res.json(articles).status(200);
});



// tested in postman completely
wordsArticlesRoute.get('/article/:id', async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers.authorization; 

    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    const spesificArticle = await getArticleByIdByUser(+userId, +id)
  
  res.json(spesificArticle).status(200);
});
  

  
  
// favorite

wordsArticlesRoute.put('/favorite/:wordId', async (req, res, next) => {
    try {

        const { wordId } = req.params;
        const token = req.headers.authorization; 
        
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    // get the word with the userId and wordId
    const word = await favoriteToWord(+wordId, +userId);

    res.json(word).status(200);
    } catch (e) {
        console.log(e);       
    }   
});

  
// un favorite
wordsArticlesRoute.put('/unfavorite/:wordId', async (req, res, next) => {
    try {
        const { wordId } = req.params;
        const token = req.headers.authorization; 
        
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    // get the word with the userId and wordId
    const word = await unFavoriteToWord(+wordId, +userId);

    res.json(word).status(200);
    } catch (e) {
        console.log(e);       
    }   
});



// delete
wordsArticlesRoute.delete('/deleteWord/:wordId', async (req, res, next) => {
    try {
        const { wordId } = req.params;
        const token = req.headers.authorization; 
        
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);
    
    // get the word with the userId and wordId
    const word = await deleteWord(+wordId, +userId);

    res.json(word).status(200);
    } catch (e) {
        console.log(e);       
    }   
});


wordsArticlesRoute.get('/wordsbank', async (req, res, next) => {
    try {
        const token = req.headers.authorization; 
        
    const user : UserModel = jwt_decode(token);

    // get the words from bank
    const words = await getAllWordsBank();

    res.json(words).status(200);
    } catch (e) {
        console.log(e);       
    }   
});


wordsArticlesRoute.post('/wordfrombank', async (req, res, next) => {
    try {
        const {hebrewWord, englishWord} = req.body.word;
        const token = req.headers.authorization; 
        
    const user : UserModel = jwt_decode(token);
    const userId = await getUserIdByEmail(user.email);

        
    // get the words from bank
    const word = await addWordToUser(userId, hebrewWord, englishWord);

    res.json(word).status(200);
    } catch (e) {
        console.log(e);       
    }   
});
