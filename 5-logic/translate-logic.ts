import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai";
dotenv.config({ path: ".env" });



export async function Test() {


        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            
        });
        const openai = new OpenAIApi(configuration);
    
        try {
            const completion = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: "Hello world",
            });
            console.log(completion.data.choices[0].text);
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
            } else {
              console.log(error.message);
            }
          }

    }


export async function saveSelectedWordByUser(word, translatedWord) {

    // save the words in mysql db

}


