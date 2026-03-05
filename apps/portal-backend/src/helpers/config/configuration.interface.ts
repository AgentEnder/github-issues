import type { z } from 'zod';

import type { environmentSchema } from './environment.schema';

type EnvironmentZodInferred<TEnv extends keyof z.infer<typeof environmentSchema>> = z.infer<
	typeof environmentSchema
>[TEnv];

export interface ConfigurationInterface {
	readonly nodeEnv: EnvironmentZodInferred<'NODE_ENV'>;
	readonly port: EnvironmentZodInferred<'PORT'>;
	readonly corsOriginFrontendUrl: EnvironmentZodInferred<'CORS_ORIGIN_FRONTEND_URL'>;
}
