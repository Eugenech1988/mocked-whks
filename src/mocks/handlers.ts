import { http, HttpResponse } from 'msw';
import type { TWebhook } from '@/entities/webhook';
import { DEMO_CREDENTIALS } from '@/shared/config';
import type {
  TMockCookies,
  TMockLoginRequest,
  TMockSession,
  TMockTokenFingerprintRequest,
  TMockTokenIssueRequest,
  TMockUser,
  TMockValidationPayload,
  TMockWebhookUpdateRequest,
} from './types';

const MOCK_CSRF_TOKEN = 'smart-sender-csrf-token';
const MOCK_USER: TMockUser = {
  id: 1,
  email: DEMO_CREDENTIALS.email,
  first_name: 'Demo',
  last_name: 'User',
  name: 'Demo User',
};
const MOCK_WEBHOOKS: TWebhook[] = Array.from({ length: 28 }, (_, index) => ({
  id: index + 1,
  name:
    ['Lead created', 'Order paid', 'Contact updated', 'Message delivered'][index % 4] +
    (index > 3 ? ` ${Math.floor(index / 4) + 1}` : ''),
  url: `https://example.com/webhooks/${index + 1}`,
  active: index % 5 !== 0,
  created_at: new Date(Date.UTC(2025, 0, index + 1)).toISOString(),
}));
const ISSUED_TOKENS = new Map<string, string>();
const MOCK_SESSIONS = new Map<string, TMockSession>();
const makeError = (
  status: number,
  type: string,
  message: string,
  payload?: TMockValidationPayload,
) => HttpResponse.json({ error: { type, message, ...(payload ? { payload } : {}) } }, { status });
const readJson = async <T>(request: Request) => (await request.json()) as T;
const csrfValid = (request: Request) => request.headers.get('X-CSRF-TOKEN') === MOCK_CSRF_TOKEN;
const cookieId = (cookies: TMockCookies) => cookies.smart_sender_session;
const activeSession = (cookies: TMockCookies) => {
  const session = MOCK_SESSIONS.get(cookieId(cookies) ?? '');
  return session && !session.revoked && session.expiresAt > Date.now() ? session : null;
};
const authError = () => makeError(401, 'AuthenticationException', 'Unauthenticated.');

export const MOCK_HANDLERS = [
  http.get(
    '/csrf',
    () => new HttpResponse(null, { status: 204, headers: { 'X-CSRF-TOKEN': MOCK_CSRF_TOKEN } }),
  ),
  http.post('/auth/login', async ({ request }) => {
    if (!csrfValid(request))
      return makeError(419, 'TokenMismatchException', 'CSRF token mismatch.');
    const body = await readJson<TMockLoginRequest>(request);
    if (!request.headers.get('X-Captcha-Token'))
      return makeError(422, 'ValidationException', 'The given data was invalid.', {
        email: ['Captcha is required.'],
      });
    if (body.email !== DEMO_CREDENTIALS.email || body.password !== DEMO_CREDENTIALS.password)
      return makeError(422, 'ValidationException', 'The given data was invalid.', {
        email: ['These credentials do not match our records.'],
      });
    if (!/^[a-f\d]{32}$/i.test(body.fingerprint))
      return makeError(422, 'ValidationException', 'The given data was invalid.', {
        fingerprint: ['The fingerprint is invalid.'],
      });
    const token = crypto.randomUUID();
    ISSUED_TOKENS.set(token, body.fingerprint);
    return HttpResponse.json({ device_session_token: token });
  }),
  http.post('/auth/token/issue', async ({ request }) => {
    if (!csrfValid(request))
      return makeError(419, 'TokenMismatchException', 'CSRF token mismatch.');
    const body = await readJson<TMockTokenIssueRequest>(request);
    if (ISSUED_TOKENS.get(body.device_session_token) !== body.fingerprint)
      return makeError(422, 'ValidationException', 'The given data was invalid.');
    ISSUED_TOKENS.delete(body.device_session_token);
    const id = crypto.randomUUID();
    MOCK_SESSIONS.set(id, {
      fingerprint: body.fingerprint,
      expiresAt: Date.now() + 30_000,
      revoked: false,
    });
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': `smart_sender_session=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
      },
    });
  }),
  http.post('/auth/token/rotate', async ({ request, cookies }) => {
    if (!csrfValid(request))
      return makeError(419, 'TokenMismatchException', 'CSRF token mismatch.');
    const body = await readJson<TMockTokenFingerprintRequest>(request);
    const id = cookieId(cookies);
    const session = id ? MOCK_SESSIONS.get(id) : undefined;
    if (!session || session.revoked || session.fingerprint !== body.fingerprint)
      return makeError(400, 'BadRequestException', 'Session cannot be rotated.');
    session.expiresAt = Date.now() + 30_000;
    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': `smart_sender_session=${id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`,
      },
    });
  }),
  http.post('/auth/token/revoke', async ({ request, cookies }) => {
    if (!csrfValid(request))
      return makeError(419, 'TokenMismatchException', 'CSRF token mismatch.');
    const id = cookieId(cookies);
    const session = id ? MOCK_SESSIONS.get(id) : undefined;
    if (session) session.revoked = true;
    return new HttpResponse(null, {
      status: 204,
      headers: { 'Set-Cookie': 'smart_sender_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' },
    });
  }),
  http.get('/v1/me', ({ cookies }) =>
    activeSession(cookies) ? HttpResponse.json(MOCK_USER) : authError(),
  ),
  http.get('/v1/webhooks', ({ request, cookies }) => {
    if (!activeSession(cookies)) return authError();
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 10);
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const filtered = MOCK_WEBHOOKS.filter(item => item.name.toLowerCase().includes(search));
    const sort = url.searchParams.get('sort');
    const direction = url.searchParams.get('direction') === 'desc' ? -1 : 1;
    if (sort === 'name' || sort === 'url' || sort === 'active') {
      filtered.sort((left, right) => {
        const leftValue = left[sort];
        const rightValue = right[sort];
        const comparison =
          typeof leftValue === 'boolean' && typeof rightValue === 'boolean'
            ? Number(leftValue) - Number(rightValue)
            : String(leftValue).localeCompare(String(rightValue));
        return comparison * direction;
      });
    }
    const last = Math.max(1, Math.ceil(filtered.length / limit));
    return HttpResponse.json({
      data: filtered.slice((page - 1) * limit, page * limit),
      paging: {
        pages: { current: page, last },
        results: { total: filtered.length, limitation: limit },
      },
    });
  }),
  http.get('/v1/webhooks/:id', ({ params, cookies }) => {
    if (!activeSession(cookies)) return authError();
    const webhook = MOCK_WEBHOOKS.find(item => item.id === Number(params.id));
    return webhook
      ? HttpResponse.json(webhook)
      : makeError(404, 'NotFoundException', 'Webhook not found.');
  }),
  http.put('/v1/webhooks/:id', async ({ params, request, cookies }) => {
    if (!csrfValid(request))
      return makeError(419, 'TokenMismatchException', 'CSRF token mismatch.');
    if (!activeSession(cookies)) return authError();
    const body = await readJson<TMockWebhookUpdateRequest>(request);
    const errors: TMockValidationPayload = {};
    if (!body.name?.trim()) errors.name = ['The name field is required.'];
    try {
      const parsed = new URL(body.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      errors.url = ['The url must be a valid URL.'];
    }
    if (Object.keys(errors).length)
      return makeError(422, 'ValidationException', 'The given data was invalid.', errors);
    const webhook = MOCK_WEBHOOKS.find(item => item.id === Number(params.id));
    if (!webhook) return makeError(404, 'NotFoundException', 'Webhook not found.');
    Object.assign(webhook, {
      name: body.name.trim(),
      url: body.url,
      active: body.active ?? webhook.active,
    });
    return HttpResponse.json(webhook);
  }),
];
