import { Router } from 'express';

import { deleteInput, getInputs, patchInput, postInput } from '@aon/controller-input';

export const inputRoute = (router: Router) => {
  router.route('/input').get(getInputs).post(postInput).patch(patchInput).delete(deleteInput);
};
