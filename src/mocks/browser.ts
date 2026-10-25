import { setupWorker } from 'msw/browser';
import { MOCK_HANDLERS } from './handlers';
export const MOCK_WORKER = setupWorker(...MOCK_HANDLERS);
