import { hrtime } from 'process';

import * as solvers from './solvers';

type Solution = {
  result: string;
  time: number;
};

export const runSolution = async (year: number, day: number, part: 1 | 2, input: string): Promise<Solution> => {
  const solve = solvers[`day_${day}_${year}`];
  if (!solve) throw new Error(`No solver found for December ${day}, ${year}`);

  const start = hrtime.bigint();
  try {
    const result = solve(input, part);
    const end = hrtime.bigint();

    return { result: `${result}`, time: Number((end - start) / BigInt(1000)) };
  } catch (err) {
    const end = hrtime.bigint();
    return { result: err.message, time: Number((end - start) / BigInt(1000)) };
  }
};
