import { Request, Response } from 'express';
import { Worker } from 'worker_threads';

import { InputModel } from '@aon/util-types';

let currentWorker: Worker;

export const postSolution = async (req: Request, res: Response) => {
  try {
    const { id, part } = req.body;

    if (id) {
      const { year, day, input } = await InputModel.findById(id).select(['year', 'day', 'input']).exec();
      await currentWorker?.terminate();

      const worker = new Worker(new URL('@aon/solver', import.meta.url), { workerData: { year, day, part, input } });
      worker.on('message', message => {
        res.status(201).json(message);
      });
      worker.on('exit', code => {
        if (code !== 0) {
          res.status(201).json({ result: `Thread terminated with exit code: ${code}`, time: 0 });
        }
      });
      currentWorker = worker;
    } else {
      await currentWorker?.terminate();
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
