import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { MOCK_SERVER } from '@/mocks/server';
import { api, setSessionActive } from './instance';
import type { TTestProtectedResponse } from './instance.test.types';

describe('API auth retry', () => {
  beforeAll(() => MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => {
    MOCK_SERVER.resetHandlers();
    setSessionActive(false);
  });
  afterAll(() => MOCK_SERVER.close());

  it('shares one rotate request for parallel 401 responses, then retries both requests', async () => {
    setSessionActive(true);
    const attempts = new Map<string, number>();
    let rotations = 0;
    MOCK_SERVER.use(
      http.get('/__test/protected/:id', ({ params }) => {
        const id = String(params.id);
        const attempt = attempts.get(id) ?? 0;
        attempts.set(id, attempt + 1);
        return attempt === 0 ? HttpResponse.json({}, { status: 401 }) : HttpResponse.json({ id });
      }),
      http.post('/auth/token/rotate', () => {
        rotations += 1;
        return new HttpResponse(null, { status: 200 });
      }),
      http.get(
        '/csrf',
        () => new HttpResponse(null, { status: 204, headers: { 'X-CSRF-TOKEN': 'test-csrf' } }),
      ),
    );

    const [first, second] = await Promise.all([
      api.get<TTestProtectedResponse>('/__test/protected/first'),
      api.get<TTestProtectedResponse>('/__test/protected/second'),
    ]);

    expect(first.data.id).toBe('first');
    expect(second.data.id).toBe('second');
    expect(rotations).toBe(1);
    expect(attempts.get('first')).toBe(2);
    expect(attempts.get('second')).toBe(2);
  });
});
