import { CalendarDay } from './CalendarDay';

const [year, day] = [2015, 25];

describe('CalendarDay', () => {
  const checkCalendarDay: (calendarDay: CalendarDay) => void = () => {
    // intentionally left blank
  };

  it('has required fields ', () => {
    // @ts-expect-error year is required
    checkCalendarDay({ day });
    // @ts-expect-error day is required
    checkCalendarDay({ year });

    checkCalendarDay({ year, day });
  });
});
