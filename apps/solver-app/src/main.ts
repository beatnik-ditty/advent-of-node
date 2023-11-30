import express, { Router } from 'express';

import { cancel, solve } from './solver';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(express.json());

const router = Router();
router.route('/solve').post(solve);
router.route('/cancel').post(cancel);

app.use('/api', router);

const server = app.listen(port, () => {
  console.log(`Solver app listening at http://${host}:${port}/api`);
});
server.on('error', console.error);
