import { hrtime } from 'process';
import { parentPort, workerData } from 'worker_threads';

import * as solvers from './solvers';

const { year, day, part, input } = workerData;

const solver = solvers[`day_${day}_${year}`];
const start = hrtime.bigint();
if (!solver) {
  parentPort.postMessage({ result: `No solver found for December ${day}, ${year}` });
} else {
  try {
    const result = solver(input, part);
    const time = Number((hrtime.bigint() - start) / 1000n);
    parentPort.postMessage({ result, time });
  } catch (err) {
    const time = Number((hrtime.bigint() - start) / 1000n);
    parentPort.postMessage({ result: err.message, time });
  }
}
