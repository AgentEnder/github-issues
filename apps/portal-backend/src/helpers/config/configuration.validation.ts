import { fromError } from 'zod-validation-error';

import { environmentSchema } from './environment.schema';

export const validateConfiguration = async (config: Record<string, unknown>) => {
	const validationResult = await environmentSchema.safeParseAsync(config);

	if (!validationResult.success) {
		const validationError = fromError(validationResult.error, {
			issueSeparator: ', ',
			prefix: 'Invalid configuration',
		});

		throw new Error(validationError.message);
	}

	return validationResult.data;
};
