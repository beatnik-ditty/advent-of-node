import { Request, Response } from 'express';

import { runSolution } from '@aon/solver';
import { InputModel } from '@aon/util-types';

export const postSolution = async (req: Request, res: Response) => {
  try {
    const { id, part } = req.body;

    const { year, day, input } = await InputModel.findById(id).select(['year', 'day', 'input']).exec();
    const solution = await runSolution(year, day, part, input);

    res.status(201).json({ ...solution });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
