import { z } from 'zod';

export const UPDATE_WEBHOOK_SCHEMA = z.object({
  name: z.string().trim().min(1, 'The name field is required.'),
  url: z
    .string()
    .trim()
    .min(1, 'Enter a URL.')
    .pipe(z.url({ protocol: /^https?$/, error: 'Enter a valid HTTP or HTTPS URL.' })),
  active: z.boolean(),
});
