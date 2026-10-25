import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes, QueryProvider } from './providers';
import './style.css';

const bootstrap = async () => {
  if (import.meta.env.DEV) {
    try {
      const { MOCK_WORKER } = await import('@/mocks/browser');
      await MOCK_WORKER.start({ onUnhandledRequest: 'bypass' });
    } catch (error) {
      console.error('Mock service worker failed to start:', error);
    }
  }
  const root = document.getElementById('root');
  if (!root) {
    console.error('Application root element #root was not found.');
    return;
  }
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <QueryProvider>
          <AppRoutes />
        </QueryProvider>
      </BrowserRouter>
    </StrictMode>,
  );
};

void bootstrap().catch(error => console.error('Application bootstrap failed:', error));
