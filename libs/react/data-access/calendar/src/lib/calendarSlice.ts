import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getPresentDate } from '@aon/util-date';
import { loadState, saveState } from '@aon/util-local-storage';

const calendar = 'calendar';

export interface CalendarState {
  year: number;
  previousYear: number;
  starFetchRequests: { [year: number]: boolean };
}

const { year: loadedYear } = loadState(calendar);
const { year: presentYear } = getPresentDate();
const year = loadedYear ?? presentYear;

const initialState: CalendarState = {
  year,
  previousYear: year,
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
  },
});

export const { startYearChange, endYearChange } = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
