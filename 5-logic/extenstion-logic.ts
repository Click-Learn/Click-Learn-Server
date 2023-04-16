import axios from "axios";

export async function translateText(text) {
    // const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    // const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
    // const sourceLanguage = 'en';
    // const targetLanguage = 'he';
  
    // try {
    //   const response = await axios.post(`${apiUrl}?key=${apiKey}`, {
    //     q: text,
    //     source: sourceLanguage,
    //     target: targetLanguage,
    //     format: 'text'
    //   }, {
    //     headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    //   });
      
    //   console.log(response.data.data.translations[0].translatedText);
    //   return response.data.data.translations[0].translatedText;
    // } catch (error) {
    //   throw new Error('Translation API request failed');
    // }

    return "שלום"
  }

