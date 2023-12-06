import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getPresentDate } from '@aon/util-date';
import { loadState, saveState } from '@aon/util-local-storage';

const calendar = 'calendar';

export interface CalendarState {
  year: number;
  previousYear: number;
  presentYear: number;
  presentDay: number;
  starFetchRequests: { [year: number]: boolean };
}

const { year: loadedYear } = loadState(calendar);
const { year: presentYear, day: presentDay } = getPresentDate();
const year = loadedYear ?? presentYear;

const initialState: CalendarState = {
  year,
  previousYear: year,
  presentYear,
  presentDay,
  starFetchRequests: {},
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    startYearChange: (state, { payload }: PayloadAction<number>) => {
      state.year = payload;
      saveState(calendar, (currentState: CalendarState) => {
        currentState.year = state.year;
      });
    },
    endYearChange: state => {
      state.previousYear = state.year;
    },
    updatePresentDate: state => {
      const { year, day } = getPresentDate();
      state.presentYear = year;
      state.presentDay = day;
    },
  },
});

export const { startYearChange, endYearChange, updatePresentDate } = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
