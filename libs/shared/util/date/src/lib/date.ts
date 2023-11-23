import { CalendarDay } from '@aon/util-types';

export const getFirstYear = () => 2015;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  timeZoneName: 'short',
});

export const presentDate = () => {
  const [month, day, year] = dateFormat
    .format(new Date())
    .split(/\/|,.*$/gi)
    .map(Number);

  switch (month) {
    case 12:
      return { year, day: Math.min(day, 25) };
    case 11:
      return { year, day: 0 };
    default:
      return { year: year - 1, day: 25 };
  }
};

const date: CalendarDay = presentDate();

export const getPresentDate = (): CalendarDay => {
  return { ...date };
};

export const hasDateOccured = ({ year: testYear, day: testDay }: CalendarDay) => {
  const { day, year } = presentDate();
  return testYear < year || (testYear === year && testDay <= day);
};
