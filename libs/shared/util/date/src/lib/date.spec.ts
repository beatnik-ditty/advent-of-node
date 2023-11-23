import { getFirstYear, getPresentDate, hasDateOccured, presentDate } from './date';

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
      expect(presentDate()).toEqual({ year: 2015, day: 25 });
    });
    it('before December in New York', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 4)));
      expect(presentDate()).toEqual({ year: 2016, day: 0 });
    });
    it('December 1st', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 1, 5)));
      expect(presentDate()).toEqual({ year: 2016, day: 1 });
    });
    it('Christmas Eve', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 25, 4)));
      expect(presentDate()).toEqual({ year: 2016, day: 24 });
    });
    it('Christmas Day', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 11, 25, 5)));
      expect(presentDate()).toEqual({ year: 2016, day: 25 });
    });
    it("New Year's Eve", () => {
      jest.setSystemTime(new Date(Date.UTC(2017, 0)));
      expect(presentDate()).toEqual({ year: 2016, day: 25 });
    });
  });

  describe('Verify behavior of date calculation', () => {
    it('getPresentDate() initializes once', () => {
      jest.setSystemTime(new Date(Date.UTC(2016, 0)));
      const presentDate = getPresentDate();
      jest.setSystemTime(new Date(Date.UTC(2017, 0)));
      expect(getPresentDate()).toEqual(presentDate);
    });
  });
});

describe('hasDateOccured', () => {
  // TODO
  it('should exist', () => {
    expect(hasDateOccured).toBeDefined();
  });
});
