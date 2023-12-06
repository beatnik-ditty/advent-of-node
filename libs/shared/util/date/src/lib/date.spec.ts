import { getFirstYear, getPresentDate, hasDateOccured, timeUntilMidnight } from './date';

describe('first year', () => {
  it('is correct', () => {
    expect(getFirstYear()).toBe(2015);
  });
});

describe('current date', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  describe('dates are correct', () => {
    it('before November in New York', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 10, 1)));
      expect(getPresentDate()).toEqual({ year: 2015, day: 25 });
    });
    it('before December in New York', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 4)));
      expect(getPresentDate()).toEqual({ year: 2016, day: 0 });
    });
    it('December 1st', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 5)));
      expect(getPresentDate()).toEqual({ year: 2016, day: 1 });
    });
    it('Christmas Eve', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 25, 4)));
      expect(getPresentDate()).toEqual({ year: 2016, day: 24 });
    });
    it('Christmas Day', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 25, 5)));
      expect(getPresentDate()).toEqual({ year: 2016, day: 25 });
    });
    it("New Year's Eve", () => {
      jest.setSystemTime(new Date(Date.UTC(2017, 0)));
      expect(getPresentDate()).toEqual({ year: 2016, day: 25 });
    });
  });
});

describe('timeRemaining', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  it('UTC same date', () => {
    jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 3, 59, 27, 400)));
    expect(timeUntilMidnight()).toEqual({ h: 1, m: 0, s: 32, ms: 600 });
  });

  it('After NY midnight should be negative', () => {
    jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 5, 0, 2, 570)));
    expect(timeUntilMidnight().h).toBeLessThan(0);
  });

  it('UTC next date', () => {
    jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 20, 30, 0, 101)));
    expect(timeUntilMidnight()).toEqual({ h: 8, m: 29, s: 59, ms: 899 });
  });
});

describe('hasDateOccured', () => {
  // TODO
  it('should exist', () => {
    expect(hasDateOccured).toBeDefined();
  });
});
