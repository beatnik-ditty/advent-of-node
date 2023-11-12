import { Request, Response } from 'express';

import { fetchMainPuzzle } from '@aon/service-aoc';
import { PuzzleModel } from '@aon/util-types';

export const getPuzzle = async (req: Request & { query: { year: string; day: string } }, res: Response) => {
  try {
    const year = parseInt(req.query.year);
    const day = parseInt(req.query.day);

    if (!isNaN(year) && !isNaN(day)) {
      const puzzle = await PuzzleModel.findOne({ year, day }).exec();
      res.json(puzzle);
    } else {
      res.status(400).json({ message: 'invalid date' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postPuzzle = async (req: Request, res: Response) => {
  try {
    const { year, day } = req.body;

    const newPuzzle = await fetchMainPuzzle(year, day).then(main => PuzzleModel.create({ year, day, main }));
    res.status(201).json(newPuzzle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const patchPuzzle = async (req: Request, res: Response) => {
  try {
    const { year, day } = req.body;

    await fetchMainPuzzle(year, day).then(main => PuzzleModel.findOneAndUpdate({ year, day }, { main }));
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
