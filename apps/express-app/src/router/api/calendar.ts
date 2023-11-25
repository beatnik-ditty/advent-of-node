import { Router } from 'express';

import { getCalendar, patchCalendar, postCalendar } from '@aon/controller-calendar';

export const calendarRoute = (router: Router) => {
  router.route('/calendar').get(getCalendar).post(postCalendar).patch(patchCalendar);
};
