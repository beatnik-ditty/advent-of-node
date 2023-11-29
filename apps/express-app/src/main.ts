import cors from 'cors';
import express from 'express';
import * as path from 'path';

import { initMongoService } from '@aon/service-mongo';
import { apiRouter, router } from './router';

const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const server = app.listen(port, () => {
  console.log(`Express app listening at http://${host}:${port}`);
});
server.on('error', console.error);

initMongoService();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'react-app')));

app.use('/', router());
app.use('/api', apiRouter());
