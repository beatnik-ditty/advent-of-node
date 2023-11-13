import { parentPort, workerData } from 'worker_threads';

import * as solvers from './solvers';

const { year, day, part, input } = workerData;

const solver = solvers[`day_${day}_${year}`];
if (!solver) {
  parentPort.postMessage(`No solver found for December ${day}, ${year}`);
} else {
  try {
    const result = solver(input, part);
    parentPort.postMessage(`${result}`);
  } catch (err) {
    parentPort.postMessage(err.message);
  }
}
