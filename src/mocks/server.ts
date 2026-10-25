import { setupServer } from 'msw/node';
import { MOCK_HANDLERS } from './handlers';
export const MOCK_SERVER = setupServer(...MOCK_HANDLERS);
