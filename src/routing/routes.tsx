import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { MainChat } from '../pages/MainChat';
import LoggedGuard from './LoggedGuard';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    path: '/chat',
    element: (
      <LoggedGuard>
        <MainChat />
      </LoggedGuard>
    ),
  },
]);

export default router;
