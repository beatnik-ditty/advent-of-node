import { Request, Response } from 'express';

import { cancel, solve } from '@aon/solver';
import { InputModel } from '@aon/util-types';

export const postSolution = async (req: Request, res: Response) => {
  try {
    const { id, part } = req.body;

    if (id) {
      const { year, day, input } = await InputModel.findById(id).select(['year', 'day', 'input']).exec();
      const solution = await solve(year, day, part, input);

      res.status(201).json({ ...solution });
    } else {
      await cancel();

      res.sendStatus(200);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
