import { Router } from 'express';

import { postSolution } from '@aon/controller-solver';

export const solverRoute = (router: Router) => {
  router.route('/solve').post(postSolution);
};
