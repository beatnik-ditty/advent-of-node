import { Router } from 'express';

import { getPuzzle, patchPuzzle, postPuzzle } from '@aon/controller-puzzle';

export const puzzleRoute = (router: Router) => {
  router.route('/puzzle').get(getPuzzle).post(postPuzzle).patch(patchPuzzle);
};
