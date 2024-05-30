import { z } from 'zod';
export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string(),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;
