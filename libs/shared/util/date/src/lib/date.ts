import { CalendarDay } from '@aon/util-types';

export const getFirstYear = () => 2015;

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  timeZoneName: 'short',
});

export const getPresentDate = (): CalendarDay => {
  const [month, day, year] = dateFormat
    .format(new Date())
    .split(/\/|,.*$/gi)
    .map(Number);

  switch (month) {
    case 12:
      return { year, day: Math.min(day, 25) };
    case 11:
      return { year, day: day - 30 };
    default:
      return { year: year - 1, day: 25 };
  }
};

export const timeUntilMidnight = (): { h: number; m: number; s: number; ms: number } => {
  // JS Date is iffy with timezones besides browser's local time and UTC, so we use UTC.
  const now = new Date();
  const midnight = new Date(now.getTime());
  midnight.getUTCHours() >= 17 && midnight.setUTCDate(midnight.getUTCDate() + 1);
  midnight.setUTCHours(5, 0, 0, 0);
  const time = midnight.getTime() - now.getTime();
  return {
    h: Math.floor(time / (1000 * 60 * 60)),
    m: Math.floor(time / (1000 * 60)) % 60,
    s: Math.floor(time / 1000) % 60,
    ms: time % 1000,
  };
};

export const hasDateOccured = ({ year: testYear, day: testDay }: CalendarDay) => {
  const { day, year } = getPresentDate();
  return testYear < year || (testYear === year && testDay <= day);
};
