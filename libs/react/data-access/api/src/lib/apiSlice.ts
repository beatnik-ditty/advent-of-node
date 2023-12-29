import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Calendar, CalendarDay, Input, Inputs, Puzzle } from '@aon/util-types';

const { VITE_EXPRESS_SERVER_URL } = import.meta.env;

const CALENDAR = '/calendar';
const PUZZLE = '/puzzle';
const INPUT = '/input';
const SOLVE = '/solve';

export const apiSlice = createApi({
  reducerPath: 'aocApi',
  baseQuery: fetchBaseQuery({ baseUrl: VITE_EXPRESS_SERVER_URL ? new URL('/api', VITE_EXPRESS_SERVER_URL).toString() : '/api' }),
  tagTypes: ['Calendar', 'Puzzle', 'Input'],
  endpoints: builder => ({
    // GET
    fetchCalendar: builder.query<Calendar & { totalStars: number }, { year: number }>({
      query: ({ year }) => ({
        url: `${CALENDAR}?year=${year}`,
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Calendar', id: arg.year }],
      transformResponse: (calendar: Calendar) => ({
        totalStars: calendar?.days?.map(({ stars }) => stars).reduce((acc, val) => acc + val, 0),
        ...calendar,
      }),
    }),
    fetchPuzzle: builder.query<Puzzle, CalendarDay>({
      query: ({ year, day }) => ({
        url: `${PUZZLE}?year=${year}&day=${day}`,
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Puzzle', id: `${arg.year}_${arg.day}` }],
    }),
    fetchInput: builder.query<Inputs, CalendarDay & { custom: boolean; mostRecent?: boolean }>({
      query: arg => ({
        url: `${INPUT}?${
          'id' in arg ? `id=${arg.id}` : `year=${arg.year}&day=${arg.day}&custom=${arg.custom}${arg.mostRecent ? '&mostRecent=true' : ''}`
        }`,
      }),
      providesTags: (_result, _error, arg) => [{ type: 'Input', id: `${arg.custom ? 'c' : ''}${arg.year}_${arg.day}` }],
    }),

    // POST
    createCalendar: builder.mutation<Calendar, { year: number }>({
      query: body => ({
        url: CALENDAR,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Calendar', id: arg.year }],
    }),
    createPuzzle: builder.mutation<Puzzle, CalendarDay>({
      query: body => ({
        url: PUZZLE,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Puzzle', id: `${arg.year}_${arg.day}` }],
    }),
    createInput: builder.mutation<Input, CalendarDay & { custom: boolean; title?: string; input?: string }>({
      query: body => ({
        url: INPUT,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => (arg.custom ? [] : [{ type: 'Input', id: `${arg.year}_${arg.day}` }]),
    }),
    createSolution: builder.mutation<{ result: string; time: number }, { id: string; part: 1 | 2 }>({
      query: body => ({
        url: SOLVE,
        method: 'POST',
        body,
      }),
    }),
    cancelSolution: builder.mutation<null, null>({
      query: () => ({
        url: SOLVE,
        method: 'POST',
        body: {},
      }),
    }),

    // PATCH
    updateCalendar: builder.mutation<string, { year: number; day?: number; stars?: number; title?: string }>({
      query: body => ({
        url: CALENDAR,
        method: 'PATCH',
        body,
        responseHandler: response => response.text(),
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Calendar', id: arg.year }],
    }),
    updatePuzzle: builder.mutation<string, CalendarDay>({
      query: body => ({
        url: PUZZLE,
        method: 'PATCH',
        body,
        responseHandler: response => response.text(),
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Puzzle', id: `${arg.year}_${arg.day}` }],
    }),
    updateInput: builder.mutation<string, CalendarDay & { id: string; position?: 1 | -1 } & Partial<Input>>({
      query: ({ year, day, ...body }) => ({
        url: INPUT,
        method: 'PATCH',
        body,
        responseHandler: response => response.text(),
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Input', id: `c${arg.year}_${arg.day}` }],
    }),

    // DELETE
    deleteInput: builder.mutation<string, CalendarDay & { id: string }>({
      query: ({ year, day, ...body }) => ({
        url: INPUT,
        method: 'DELETE',
        body,
        responseHandler: response => response.text(),
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Input', id: `c${arg.year}_${arg.day}` }],
    }),
  }),
});

export const {
  useFetchCalendarQuery,
  useFetchPuzzleQuery,
  useFetchInputQuery,

  useCreateCalendarMutation,
  useCreatePuzzleMutation,
  useCreateInputMutation,
  useCreateSolutionMutation,
  useCancelSolutionMutation,

  useUpdateCalendarMutation,
  useUpdatePuzzleMutation,
  useUpdateInputMutation,

  useDeleteInputMutation,
} = apiSlice;
