import type { ClsService, ClsModuleOptions } from 'nestjs-cls';

export const setupAsyncStorageFactory = (): ClsModuleOptions => ({
	global: true,
	// * Cannot use interceptor because a global exception filter won't be able to inject correctly the storage (because of lifecycle in NestJS)
	middleware: {
		mount: true,
		generateId: true,
		setup: (cls: ClsService) => {
			cls.set('loggerMetadata', { requestId: cls.getId() });
		},
	},
});
