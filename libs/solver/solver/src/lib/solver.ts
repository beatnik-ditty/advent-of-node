import { exit, hrtime } from 'process';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@aon/solver-helpers';

export const { input, part }: { input: string; part: 1 | 2 } = workerData;

parentPort.postMessage({ start: hrtime.bigint() });

export const output = (result: unknown) => {
  parentPort.postMessage({ result: `${result}`, end: hrtime.bigint() });
  exit();
};
const { year, day } = workerData;

try {
  require(`./${year}/Day${day < 10 ? '0' : ''}${day}`);
} catch (err) {
  output(err.message);
}

output('Did not reach output() statement in solution');
