import { z } from 'zod';

export const LOGIN_SCHEMA = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email({ error: 'Enter a valid email address, for example name@example.com.' })),
  password: z.string().min(1, 'Enter your password.'),
});
