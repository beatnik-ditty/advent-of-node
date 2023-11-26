import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { Calendar, CalendarModel } from './Calendar';

const calendarData = { year: 2015, days: [{ stars: 0, title: 'title' }], id: 'id' };

const checkCalendar: (calendar: Calendar) => void = () => {
  // intentionally left blank
};

describe('Calendar', () => {
  it('has required fields', () => {
    checkCalendar(calendarData);

    const { year, ...noYear } = calendarData;
    // @ts-expect-error year is required
    checkCalendar(noYear);

    const { days, ...noDays } = calendarData;
    // @ts-expect-error day array is required
    checkCalendar(noDays);

    const { id, ...noId } = calendarData;
    // @ts-expect-error id is required
    checkCalendar(noId);
  });

  it('days array object has required fields', () => {
    const { days, ...noDays } = calendarData;
    const [{ stars, title }] = days;

    // @ts-expect-error star count required
    checkCalendar({ days: [{ title }], ...noDays });
    // @ts-expect-error title required
    checkCalendar({ days: [{ stars }], ...noDays });
  });
});

describe('Calendar model', () => {
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
    const calendar = await CalendarModel.create(calendarData);
    expect(calendar._id).toBeDefined();

    checkCalendar(calendar);
  });

  it('fails on missing required fields', async () => {
    const { year, ...noYear } = calendarData;

    let err: { errors: { year: unknown } };
    try {
      await CalendarModel.create(noYear);
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.year).toBeDefined();
  });
});
