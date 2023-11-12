import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Puzzle, PuzzleModel } from './Puzzle';

const puzzleData = { year: 2015, day: 25, id: 'id' };
const mainData = { name: 'main', nodeType: 1 as const, attributes: { name: 'value' }, childNodes: [] };
const textNodeData = { name: '#text' as const, nodeType: 3 as const, text: 'text' };

const checkPuzzle: (puzzle: Puzzle) => void = () => {
  // intentionally left blank
};

describe('Puzzle', () => {
  it('has required fields', () => {
    checkPuzzle(puzzleData);

    const { year, ...noYear } = puzzleData;
    // @ts-expect-error year is required
    checkPuzzle(noYear);

    const { day, ...noDay } = puzzleData;
    // @ts-expect-error day is required
    checkPuzzle(noDay);

    const { id, ...noId } = puzzleData;
    // @ts-expect-error id is required
    checkPuzzle(noId);
  });

  it('has main field', () => {
    checkPuzzle({ year: 2015, day: 25, id: 'id', main: null });
  });

  it('puzzle node has required fields', () => {
    checkPuzzle({ ...puzzleData, main: mainData });

    const { name, ...noName } = mainData;
    // @ts-expect-error name is required
    checkPuzzle({ ...puzzleData, main: noName });

    const { nodeType, ...noNodeType } = mainData;
    // @ts-expect-error nodeType is required
    checkPuzzle({ ...puzzleData, main: noNodeType });

    const { attributes, ...noAttributes } = mainData;
    // @ts-expect-error attributes is required
    checkPuzzle({ ...puzzleData, main: noAttributes });

    const { childNodes, ...noChildNodes } = mainData;
    // @ts-expect-error childNodes is required
    checkPuzzle({ ...puzzleData, main: noChildNodes });
  });

  it('text nodes have required fields', () => {
    const { childNodes, ...noChildNodes } = mainData;
    checkPuzzle({ ...puzzleData, main: { ...noChildNodes, childNodes: [textNodeData] } });

    const { name, ...noName } = textNodeData;
    // @ts-expect-error name is required
    checkPuzzle({ ...puzzleData, main: { ...noChildNodes, childNodes: [noName] } });

    const { nodeType, ...noNodeType } = textNodeData;
    // @ts-expect-error nodeType is required
    checkPuzzle({ ...puzzleData, main: { ...noChildNodes, childNodes: [noNodeType] } });

    const { text, ...noText } = textNodeData;
    // @ts-expect-error text is required
    checkPuzzle({ ...puzzleData, main: { ...noChildNodes, childNodes: [noText] } });
  });
});

describe('Puzzle model', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const url = mongo.getUri();
    await mongoose.connect(url);
  });

  afterEach(async () => {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('validates required fields', async () => {
    const puzzle = await PuzzleModel.create(puzzleData);
    expect(puzzle._id).toBeDefined();

    checkPuzzle(puzzle);
  });

  it('allows optional fields', async () => {
    const puzzle = await PuzzleModel.create({ main: mainData, ...puzzleData });
    expect(puzzle._id).toBeDefined();

    checkPuzzle(puzzle);
  });

  it('fails on missing required fields', async () => {
    const { year, ...noYear } = puzzleData;
    const { day, ...noDay } = puzzleData;

    for (const [field, partial] of Object.entries({
      year: noYear,
      day: noDay,
    })) {
      let err: { errors: { [x: string]: unknown } };
      try {
        await PuzzleModel.create(partial);
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors[field]).toBeDefined();
    }
  });
});
