import { spawn } from 'child_process';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { stderr, stdin, stdout } from 'process';

import { InputModel } from '@aon/util-types';

const { NX_SOLVER_URL, NX_SOLVER_PORT = 3000, NX_SOLVER_DEBUG_PORT = 19229 } = process.env;
const baseUrl = `${NX_SOLVER_URL || 'http://localhost'}:${NX_SOLVER_PORT}`;
const solveUrl = new URL('/api/solve', baseUrl);
const cancelUrl = new URL('/api/cancel', baseUrl);

if (!NX_SOLVER_URL) {
  // If the solver URL was manually set, presumably it's being run elsewhere and we don't want to spawn it as a child process.

  const solver = spawn('yarn', ['nx', 'run', 'solver-app:serve:develop', `--port=${NX_SOLVER_DEBUG_PORT}`]);

  stdin.on('data', data => solver.stdin.write(data));
  solver.stdout.on('data', data => stdout.write(data));
  solver.stderr.on('data', data => stderr.write(data));
}

export const postSolution = async (req: Request, res: Response) => {
  const { id, part } = req.body;

  if (id && part) {
    InputModel.findById(id)
      .select(['year', 'day', 'input'])
      .exec()
      .then(({ year, day, input }) =>
        fetch(solveUrl, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ year, day, input, part }),
        }),
      )
      .then(response => response.json())
      .then(result => res.status(201).json(result))
      .catch(err => res.status(500).json({ message: err.message }));
  } else {
    fetch(cancelUrl, { method: 'POST' })
      .then(response => res.sendStatus(response.status))
      .catch(err => res.status(500).json({ message: err.message }));
  }
};
