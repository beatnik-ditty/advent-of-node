import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { loadState, saveState } from '@aon/util-local-storage';

export interface SolverState {
  status: Status;
  day: number;
  newDay: number;
  part: 1 | 2;
  isCustomInput: boolean;
  hideCustomInput: boolean;
  hidePuzzleInput: boolean;
  pastInput: string[];
  inputs: { [day: number]: { title: string; input: string; id: string; order: number } };
  futureInput: string[];
  canSave: boolean;
}

const solver = 'solver';

export type Status = 'opening' | 'opened' | 'closing' | 'closed' | 'sliding';

const { status, day, isCustomInput, hideCustomInput, hidePuzzleInput, part } = loadState(solver);

const initialState: SolverState = {
  status: status ?? 'closed',
  day: day ?? 0,
  newDay: day ?? 0,
  part: part ?? 1,
  isCustomInput: isCustomInput ?? false,
  hideCustomInput: hideCustomInput ?? false,
  hidePuzzleInput: hidePuzzleInput ?? true,
  pastInput: [],
  inputs: { ...(day && { [day]: { title: '', input: '', id: '', order: 0 } }) },
  futureInput: [],
  canSave: false,
};

const solverSlice = createSlice({
  name: solver,
  initialState,
  reducers: {
    openSolver: (state, { payload }: PayloadAction<number>) => {
      state.day = payload;
      state.newDay = payload;
      state.inputs[payload] = { title: '', input: '', id: '', order: 0 };
      state.status = 'opening';
      saveState(solver, (currentState: SolverState) => {
        currentState.day = payload;
        currentState.status = 'opened';
      });
    },
    closeSolver: state => {
      state.status = 'closing';
      saveState(solver, (currentState: SolverState) => {
        currentState.status = 'closed';
      });
    },
    chooseDay: (state, { payload }: PayloadAction<number>) => {
      state.status = 'sliding';
      state.newDay = payload;
      state.inputs[payload] = { title: '', input: '', id: '', order: 0 };
      saveState(solver, (currentState: SolverState) => {
        currentState.day = payload;
      });
    },
    endAnimation: state => {
      switch (state.status) {
        case 'opening':
          state.status = 'opened';
          break;
        case 'closing':
          delete state.inputs[state.day];
          state.status = 'closed';
          break;
        case 'sliding':
          delete state.inputs[state.day];
          state.day = state.newDay;
          state.status = 'opened';
          break;
      }
      state.pastInput = [];
      state.futureInput = [];
    },
    toggleSetting: (state, { payload }: PayloadAction<'part' | 'hideInput' | 'useCustom'>) => {
      const updates: Partial<SolverState> = {};
      switch (payload) {
        case 'part':
          state.part = state.part === 2 ? 1 : 2;
          updates.part = state.part;
          break;
        case 'hideInput':
          if (state.isCustomInput) {
            state.hideCustomInput = !state.hideCustomInput;
            updates.hideCustomInput = state.hideCustomInput;
          } else {
            state.hidePuzzleInput = !state.hidePuzzleInput;
            updates.hidePuzzleInput = state.hidePuzzleInput;
          }
          break;
        case 'useCustom':
          state.isCustomInput = !state.isCustomInput;
          updates.isCustomInput = state.isCustomInput;
          break;
      }
      saveState(solver, (currentState: SolverState) => {
        Object.assign(currentState, updates);
      });
    },
    loadFetchedInput: (
      state,
      {
        payload: { day, title, ...inputUpdate },
      }: PayloadAction<{ day: number; id: string; order?: number; title?: string | null; input?: string }>,
    ) => {
      state.inputs[day] = { input: '', order: 0, title: title || '', ...inputUpdate };
    },
    updateTitle: (state, { payload }: PayloadAction<string>) => {
      state.inputs[state.day].title = payload;
    },
    userInput: (state, { payload }: PayloadAction<string>) => {
      if (state.status === 'opened' && state.inputs[state.day].input !== payload) {
        state.pastInput = [...state.pastInput, state.inputs[state.day].input];
        if (state.pastInput.length > 20) {
          state.pastInput = state.pastInput.slice(-20);
        }
        state.inputs[state.day].input = payload;
        state.futureInput = [];
      }
    },
    undoInput: state => {
      if (state.pastInput.length > 0) {
        state.futureInput = [state.inputs[state.day].input, ...state.futureInput];
        state.inputs[state.day].input = state.pastInput[state.pastInput.length - 1];
        state.pastInput = state.pastInput.slice(0, -1);
      }
    },
    redoInput: state => {
      if (state.futureInput.length > 0) {
        state.pastInput = [...state.pastInput, state.inputs[state.day].input];
        state.inputs[state.day].input = state.futureInput[0];
        state.futureInput = state.futureInput.slice(1);
      }
    },
    updateCanSave: (state, { payload }: PayloadAction<boolean>) => {
      state.canSave = payload;
    },
  },
});

export const {
  openSolver,
  closeSolver,
  endAnimation,
  chooseDay,
  toggleSetting,
  loadFetchedInput,
  updateTitle,
  userInput,
  undoInput,
  redoInput,
  updateCanSave,
} = solverSlice.actions;
export const solverReducer = solverSlice.reducer;
