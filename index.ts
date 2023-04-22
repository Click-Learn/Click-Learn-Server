import express, { json } from 'express';
import { catchAll } from './3-middleware/error-handle';
import { logRequest } from './3-middleware/log';
import cors from "cors";
import * as dotenv from 'dotenv';

import { authRouter } from './6-controllers/auth-controller';
import { wordsArticlesRoute } from './6-controllers/word-articles-controller';
import { extenstionRouter } from './6-controllers/extension-controller';

dotenv.config({ path: ".env" });

const server = express();
server.use(cors())
server.use(json());
server.use(logRequest);

server.use(authRouter);
server.use(wordsArticlesRoute);
server.use(extenstionRouter);
// Test();
server.use(catchAll);
server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});