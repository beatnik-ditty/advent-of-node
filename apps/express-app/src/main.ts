import cors from 'cors';
import express from 'express';
import * as path from 'path';

import { initMongoService } from '@aon/service-mongo';
import { router } from './routes';

const app = express();

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/api', (_, res) => {
  res.send({ message: 'https://youtu.be/dQw4w9WgXcQ' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

initMongoService();

app.use(express.json());
app.use('/', router());
