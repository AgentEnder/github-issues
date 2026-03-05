import type { ClsStore } from 'nestjs-cls';

export interface AsyncStorageStore extends ClsStore {
	readonly loggerMetadata: Record<string, unknown>;
	readonly beforeOverallRequest?: number;
}
