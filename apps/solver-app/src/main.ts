import express from 'express';
import { hrtime, stderr, stdin, stdout } from 'process';
import { Worker } from 'worker_threads';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const server = app.listen(port, () => {
  console.log(`Solver listening at http://${host}:${port}/api`);
});
server.on('error', console.error);

let currentWorker: Worker;
stdin.on('data', data => {
  currentWorker?.stdin.write(data);
});

app.use(express.json());

app.post('/solver', async (req, res) => {
  try {
    const { input, year, day, part } = req.body;
    await currentWorker?.terminate();

    let received: { result?: string; start?: bigint; end?: bigint } = {};
    const worker = new Worker(new URL('@aon/solver', import.meta.url), {
      stdin: true,
      stdout: true,
      stderr: true,
      workerData: { year, day, part, input },
    });
    worker.stdout.on('data', data => {
      stdout.write(data);
    });
    worker.stderr.on('data', data => {
      stderr.write(data);
    });

    worker.on('message', message => {
      received = { ...received, ...message };
    });
    worker.on('exit', code => {
      const { result, start, end } = received;
      if (code === 0) {
        res.status(201).json({ result: result ?? 'Solution runner exited with no solution', time: timeElapsed(start, end) });
      } else {
        res.status(201).json({ result: `Solution runner canceled`, time: timeElapsed(start, end) });
      }
    });
    currentWorker = worker;
  } catch (err) {
    res.status(500).json({ message: err.message, time: 0 });
  }
});

app.post('/cancel', async (req, res) => {
  await currentWorker?.terminate();
  res.sendStatus(200);
});

const timeElapsed = (start?: bigint, end?: bigint) => {
  const time = hrtime.bigint();
  return Number(((end ?? time) - (start ?? time)) / 1000n);
};
