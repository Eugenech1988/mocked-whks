# Smart Sender — Webhooks

## Run

```sh
bun install
bun run dev
```

MSW intercepts API requests in development and keeps mock data in memory. The mock contains one demo account and 28 webhooks. A page reload may require signing in again.

## Demo credentials

- Email: `demo@smartsender.com`
- Password: `SmartSender123!`

## Tests and build

```sh
bun run test:run
bun run build
```

The automated auth retry test sends two concurrent requests that each receive 401, verifies that they share one token rotation, and checks that both original requests succeed after retry.

For Cypress end-to-end tests, run the app in one terminal and Cypress in another:

```sh
bun run dev
bun run cypress:run
```

`bun run cypress:open` opens the Cypress runner. The e2e suite covers invalid credentials, URL-backed search, and editing with a success toast.

## Structure and decisions

- `src/app` — app entry, routes and providers
- `src/pages` — login and webhook list screens
- `src/features` — login/logout and webhook editing behavior
- `src/entities/webhook` — webhook types and React Query API hooks
- `src/shared/api` — Axios instance, CSRF handling and shared 401 rotation
- `src/shared/store` — Zustand session state
- `src/mocks` — MSW browser worker and in-memory handlers
- `src/shared/ui` — shadcn-style Tailwind primitives (card, dialog, input, label, badge, table, switch, button, toaster)

Cross-slice imports use public `index.ts` barrel files. React Query owns remote data and cache invalidation; Zustand stores small client session state. The device fingerprint is generated once and persisted in localStorage. The device session token is passed directly from login to token issue and is not persisted. The mock session id is an HttpOnly cookie. The mock session expires after 30 seconds; rotation renews it for another 30 seconds. CSRF 419 responses refresh the token and retry once.

The list page and search term are URL-backed. Editing validates on the server, displays field errors beside the corresponding input, and allows changing whether a webhook is active.
