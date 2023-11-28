import { spawn } from 'child_process';
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { stderr, stdin, stdout } from 'process';

import { InputModel } from '@aon/util-types';

const solver = spawn('yarn', ['nx', 'run', 'solver-app:serve:develop']);

stdin.on('data', data => solver.stdin.write(data));
solver.stdout.on('data', data => stdout.write(data));
solver.stderr.on('data', data => stderr.write(data));

const url = '';
export const postSolution = async (req: Request, res: Response) => {
  const { id, part } = req.body;

  if (id && part) {
    try {
      const { year, day, input } = await InputModel.findById(id).select(['year', 'day', 'input']).exec();
      if (year && day && input) {
        const result = await fetch(url, { method: 'POST', body: JSON.stringify({ year, day, input, part }) }).then(response =>
          response.json(),
        );
        res.status(201).json(result);
      } else {
        throw new Error('Input not found');
      }
    } catch (err) {
      res.status(400).json({ message: err.message, time: 0 });
    }
  } else {
    fetch(url, { method: 'POST' });
  }
};
