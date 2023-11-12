import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { store } from '@aon/data-access-store';
import { About } from './routes/About';
import { App } from './routes/App';
import { Root } from './routes/Root';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Root />,
    children: [
      { index: true, element: <App /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={ store }>
      <RouterProvider router={ router } />
    </Provider>
  </StrictMode>,
);
