import { Router } from 'express';
import path from 'path';

const reactPath = path.join(__dirname, '..', 'react-app');

export const reactAppRoute = (router: Router) => {
  router.route('/favicon.ico').get((_, res) => {
    res.sendFile(path.join(reactPath, 'favicon.ico'));
  });

  router.route('/').get((_, res) => {
    res.sendFile(path.join(reactPath, 'index.html'));
  });

  router.route('/about').get((_, res) => {
    res.sendFile(path.join(reactPath, 'index.html'));
  });
};
