import { hrtime } from 'process';
import { Worker } from 'worker_threads';

type Solution = {
  result: string;
  time: number;
};

let currentWorker: Worker;

export const solve = async (year: number, day: number, part: 1 | 2, input: string) => {
  await currentWorker?.terminate();
  const start = hrtime.bigint();
  return new Promise<Solution>(resolve => {
    const worker = new Worker(new URL('./runSolution.ts', import.meta.url), { workerData: { year, day, part, input } });
    worker.on('message', result => {
      const end = hrtime.bigint();
      resolve({ result, time: Number((end - start) / BigInt(1000)) });
    });
    worker.on('exit', code => {
      if (code !== 0) {
        const end = hrtime.bigint();
        resolve({ result: `Thread terminated with exit code: ${code}`, time: Number((end - start) / BigInt(1000)) });
      }
    });
    currentWorker = worker;
  });
};

export const cancel = async () => {
  await currentWorker?.terminate();
};
