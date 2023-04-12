import express, { json } from 'express';
import { catchAll } from './3-middleware/error-handle';
import { logRequest } from './3-middleware/log';
import cors from "cors";
import * as dotenv from 'dotenv';

import { TranslateRouter } from './6-controllers/translate-controller';
import { authRouter } from './6-controllers/auth-controller';
import { Test } from './5-logic/translate-logic';
import { wordsArticlesRoute } from './6-controllers/word-articles-controller';

dotenv.config({ path: ".env" });

const server = express();
server.use(cors())
server.use(json());
server.use(logRequest);

server.use(authRouter);
server.use(TranslateRouter);
server.use(wordsArticlesRoute);
// Test();
server.use(catchAll);

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});