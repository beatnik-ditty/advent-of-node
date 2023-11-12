import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Input, InputModel, Inputs } from './Input';

const inputData = { year: 2015, day: 25, order: 0, input: '', id: 'id' };

const checkInput: (input: Input) => void = () => {
  // intentionally left blank
};

const checkInputs: (inputs: Inputs) => void = () => {
  // intentionally left blank
};

describe('Input', () => {
  it('has required fields', () => {
    checkInput(inputData);

    const { year, ...noYear } = inputData;
    // @ts-expect-error year is required
    checkInput(noYear);

    const { day, ...noDay } = inputData;
    // @ts-expect-error day is required
    checkInput(noDay);

    const { order, ...noOrder } = inputData;
    // @ts-expect-error order is required
    checkInput(noOrder);

    const { input, ...noInput } = inputData;
    // @ts-expect-error input is required
    checkInput(noInput);

    const { id, ...noId } = inputData;
    // @ts-expect-error id is required
    checkInput(noId);
  });

  it('has optional fields', () => {
    checkInput({ title: 'title', mostRecent: true, ...inputData });
  });
});

describe('Inputs', () => {
  it('has required fields', () => {
    // @ts-expect-error results count is required
    checkInputs({ inputs: [] });
    // @ts-expect-error inputs array is required
    checkInputs({ results: 0 });

    checkInputs({ results: 0, inputs: [] });
  });

  it('inputs array object has required fields', () => {
    const { id, order } = inputData;
    // @ts-expect-error order is required
    checkInputs({ results: 0, inputs: [{ id }] });
    // @ts-expect-error id is required
    checkInputs({ results: 0, inputs: [{ order }] });

    checkInputs({ results: 0, inputs: [{ order, id }] });
  });

  it('inputs array object has optional fields', () => {
    checkInputs({ results: 0, inputs: [{ title: 'title', mostRecent: true, ...inputData }] });
  });
});

describe('Input model', () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const url = mongo.getUri();
    await mongoose.connect(url);
    mongoose.Schema.Types.String.checkRequired(v => v != null);
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
    const input = await InputModel.create(inputData);
    expect(input._id).toBeDefined();

    checkInput(input);
  });

  it('allows optional fields', async () => {
    const input = await InputModel.create({ title: 'title', mostRecent: true, ...inputData });
    expect(input._id).toBeDefined();

    checkInput(input);
  });

  it('fails on missing required fields', async () => {
    const { year, ...noYear } = inputData;
    const { day, ...noDay } = inputData;
    const { order, ...noOrder } = inputData;
    const { input, ...noInput } = inputData;

    for (const [field, partial] of Object.entries({
      year: noYear,
      day: noDay,
      order: noOrder,
      input: noInput,
    })) {
      let err: { errors: { [x: string]: unknown } };
      try {
        await InputModel.create(partial);
      } catch (error) {
        err = error;
      }
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(err.errors[field]).toBeDefined();
    }
  });
});
