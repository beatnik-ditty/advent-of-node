import { Request, Response } from 'express';
import { hrtime } from 'process';
import { Worker } from 'worker_threads';

import { InputModel } from '@aon/util-types';

let currentWorker: Worker;

export const postSolution = async (req: Request, res: Response) => {
  try {
    const { id, part } = req.body;

    if (id) {
      const { year, day, input } = await InputModel.findById(id).select(['year', 'day', 'input']).exec();
      await currentWorker?.terminate();

      let received: { result?: string; start?: bigint; end?: bigint } = {};

      const worker = new Worker(new URL('@aon/solver', import.meta.url), { workerData: { year, day, part, input } });
      worker.on('message', message => {
        received = { ...received, ...message };
      });
      worker.on('exit', code => {
        const { result, start, end } = received;
        if (code === 0) {
          res.status(201).json({ result, time: timeElapsed(start, end) });
        } else {
          res.status(201).json({ result: `Solution runner canceled`, time: timeElapsed(start, end) });
        }
      });
      currentWorker = worker;
    } else {
      await currentWorker?.terminate();
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(400).json({ message: err.message, time: 0 });
  }
};

const timeElapsed = (start?: bigint, end?: bigint) => {
  const time = hrtime.bigint();
  return Number(((end ?? time) - (start ?? time)) / 1000n);
};
