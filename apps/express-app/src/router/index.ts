import { Router } from 'express';

import { calendarRoute } from './api/calendar';
import { inputRoute } from './api/input';
import { puzzleRoute } from './api/puzzle';
import { solverRoute } from './api/solver';
import { reactAppRoute } from './reactApp';

const baseRouter = Router();

export const router = (): Router => {
  reactAppRoute(baseRouter);
  return baseRouter;
};

const baseApiRouter = Router();

export const apiRouter = (): Router => {
  reactAppRoute(baseApiRouter);
  calendarRoute(baseApiRouter);
  puzzleRoute(baseApiRouter);
  inputRoute(baseApiRouter);
  solverRoute(baseApiRouter);
  return baseApiRouter;
};
