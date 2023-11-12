import { Request, Response } from 'express';

import { fetchInput } from '@aon/service-aoc';
import { CalendarDay, InputModel } from '@aon/util-types';

const customInputQuery = ({ year, day }: CalendarDay) => InputModel.find({ year, day }).where('order').gte(1);

export const getInputs = async (
  req: Request & { query: { year?: string; day?: string; custom?: string; mostRecent?: string } },
  res: Response,
) => {
  try {
    const year = parseInt(req.query.year);
    const day = parseInt(req.query.day);
    const custom = req.query.custom === 'true';
    const mostRecent = req.query.mostRecent === 'true';

    if (!isNaN(year) && !isNaN(day)) {
      if (custom) {
        if (mostRecent) {
          const input = await InputModel.findOne({ year, day, mostRecent }).exec();
          res.json(input ? { results: 1, inputs: [input] } : { results: 0, inputs: [] });
        } else {
          const inputs = await InputModel.find({ year, day })
            .where('order')
            .gte(1)
            .sort({ order: 1 })
            .select(['order', 'title', 'mostRecent'])
            .exec();
          res.json({ results: inputs.length, inputs });
        }
      } else {
        const input = await InputModel.findOne({ year, day, order: 0 }).exec();
        res.json(input ? { results: 1, inputs: [input] } : { results: 0, inputs: [] });
      }
    } else {
      res.status(400).json({ message: 'invalid date' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const postInput = async (req: Request, res: Response) => {
  try {
    const { year, day, custom, input = '', title = '' } = req.body;

    if (typeof year === 'number' && typeof day === 'number') {
      if (!custom) {
        const createdInput = await fetchInput(year, day).then(input => InputModel.create({ year, day, order: 0, input }));
        res.status(201).json(createdInput);
      } else {
        const createdInput = await customInputQuery({ year, day })
          .countDocuments()
          .exec()
          .then(index => InputModel.create({ year, day, input, order: index + 1, title }));
        res.status(201).json(createdInput);
      }
    } else {
      res.status(400).json({ message: 'invalid parameters' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const patchInput = async (req: Request, res: Response) => {
  try {
    const { id, title, input, position, mostRecent } = req.body;
    const patches = [];
    if (position === 1 || position === -1) {
      patches.push(reorderInputs(id, position));
    }
    if (mostRecent) {
      patches.push(flagMostRecent(id));
    }
    if (title != null || input != null) {
      patches.push(InputModel.findByIdAndUpdate(id, { ...(title != null && { title }), ...(input != null && { input }) }));
    }
    await Promise.all(patches);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInput = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await reorderInputs(id, -1).then(() => InputModel.findByIdAndDelete(id).exec());
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const reorderInputs = async (id: string, to: 1 | -1) => {
  const { year, day, order } = await InputModel.findByIdAndUpdate(id, { order: -1 }).select(['year', 'day', 'order']).exec();
  const count = (await customInputQuery({ year, day }).countDocuments().exec()) + 1;

  if (to === 1 && order > 1) {
    await InputModel.findOneAndUpdate({ year, day, order: order - 1 }, { order })
      .select({})
      .exec();
  }
  for (let i = order + 1; to === -1 && i <= count; i++) {
    await InputModel.findOneAndUpdate({ year, day, order: i }, { order: i - 1 })
      .select({})
      .exec();
  }

  return await InputModel.findByIdAndUpdate(id, { order: to === 1 ? order - 1 : count })
    .select({})
    .exec();
};

const flagMostRecent = (id: string) =>
  InputModel.findByIdAndUpdate(id, { mostRecent: true })
    .select(['year', 'day'])
    .exec()
    .then(({ year, day }) => InputModel.findOneAndUpdate({ year, day, mostRecent: true, _id: { $ne: id } }, { $unset: { mostRecent: 1 } }));
