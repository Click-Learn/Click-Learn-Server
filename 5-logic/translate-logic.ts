import * as dotenv from 'dotenv'

dotenv.config({ path: ".env" });

export async function translateWordToHe(req, res, next) {
    const {word} = req.body;
    
    // get the translate word

    // return
}


export async function saveSelectedWordByUser(req, res, next) {
    const {word} = req.body;
    const {translatedWord} = req.body;

    // save the words in mysql db

}

