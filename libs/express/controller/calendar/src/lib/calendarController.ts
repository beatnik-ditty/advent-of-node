import { Request, Response } from 'express';

import { fetchStarCounts } from '@aon/service-aoc';
import { CalendarModel } from '@aon/util-types';

export const getCalendar = async (req: Request & { query: { year: string } }, res: Response) => {
  try {
    const year = parseInt(req.query.year);

    if (!isNaN(year)) {
      const calendar = await CalendarModel.findOne({ year }).exec();
      res.json(calendar);
    } else {
      res.status(400).json({ error: 'invalid date' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postCalendar = async (req: Request, res: Response) => {
  try {
    const { year } = req.body;

    const newCalendar = await fetchStarCounts(year).then(days => CalendarModel.create({ year, days }));
    res.status(201).json(newCalendar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const patchCalendar = async (req: Request, res: Response) => {
  try {
    const { year, day, stars, title } = req.body;

    await CalendarModel.findOneAndUpdate(
      { year },
      {
        $set:
          day == null
            ? await fetchStarCounts(year).then(days =>
                days
                  .map(({ stars }, index) => ({ [`days.${index}.stars`]: stars }))
                  .reduce((prev, current) => ({ ...prev, ...current }), {}),
              )
            : {
                ...(typeof stars === 'number' && { [`days.${day - 1}.stars`]: stars }),
                ...(title && { [`days.${day - 1}.title`]: title }),
              },
      },
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
