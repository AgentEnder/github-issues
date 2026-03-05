import { z } from 'zod';

export const environmentSchema = z.object({
	NODE_ENV: z.enum(['development', 'production']),
	PORT: z.string(),
	CORS_ORIGIN_FRONTEND_URL: z.string(),
});
