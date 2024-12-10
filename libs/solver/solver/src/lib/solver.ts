import { exit, hrtime } from 'process';
import { parentPort, workerData } from 'worker_threads';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@aon/solver-helpers';

const { year, day, input, part }: { year: number; day: number; input: string; part: 1 | 2 } = workerData;

const output = (result: unknown) => {
  parentPort.postMessage({ result: `${result}`, end: hrtime.bigint() });
  exit();
};

export { input, output, part };

parentPort.postMessage({ start: hrtime.bigint() });

try {
  await require(`./${year}/Day${day < 10 ? '0' : ''}${day}`);
} catch (err) {
  output(err.message);
}

output('Did not reach output() statement in solution');
