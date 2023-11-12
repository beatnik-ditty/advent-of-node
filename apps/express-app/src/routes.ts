import { Router } from 'express';

import { calendarRoute } from './router/calendar';
import { inputRoute } from './router/input';
import { puzzleRoute } from './router/puzzle';
import { solverRoute } from './router/solver';

const baseRouter = Router();

export const router = (): Router => {
  calendarRoute(baseRouter);
  puzzleRoute(baseRouter);
  inputRoute(baseRouter);
  solverRoute(baseRouter);
  return baseRouter;
};
