import { LoggerService as NestLoggerService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import pinoLogger, { levels } from 'pino';
import { ClsService } from 'nestjs-cls';

import type { ConfigurationInterface } from '@/helpers/config/configuration.interface';
import type { AsyncStorageStore } from '@/helpers/async-storage/types/store';

import type { NestLogsContext } from './types/nest-logs-context';

@Injectable()
export class LoggerService implements NestLoggerService {
	private logger: pinoLogger.Logger<'nest'>;
	private customLevels = { nest: 25 } as const;

	constructor(
		private readonly configService: ConfigService<ConfigurationInterface, true>,
		private readonly clsService: ClsService<AsyncStorageStore>,
	) {
		const nodeEnv = this.configService.get('nodeEnv', { infer: true });

		this.logger = pinoLogger(
			{
				base: null,
				transport:
					nodeEnv === 'development'
						? {
								target: 'pino-pretty',
								options: {
									colorize: true,
									customLevels: Object.entries({
										...levels.values,
										...this.customLevels,
									})
										.map(([key, value]) => `${key}:${value}`)
										.join(','),
									customColors:
										'debug:blueBright,nest:magentaBright,info:greenBright,warn:yellowBright,error:redBright',
								},
							}
						: undefined,
				level: nodeEnv === 'production' ? 'nest' : 'debug',
				timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
				formatters: {
					level: (label, levelValue) => ({ 'level': levelValue, 'level-label': label }),
				},
				customLevels: this.customLevels,
				mixin: () => {
					const metadata = this.clsService.get('loggerMetadata');

					if (!metadata) {
						return {};
					}

					// * Cloning so "mixin" won't auto add properties to "loggerMetadata"
					return { ...metadata };
				},
			},
			pinoLogger.destination({ sync: false }),
		);
	}

	public log(message: string, metadata: Record<string, unknown> | NestLogsContext = {}) {
		if (typeof metadata === 'string') {
			this.logger.nest(`[NestJS Internal] [${metadata}] ${message}`);
		} else {
			this.logger.info(metadata, message);
		}
	}

	public error(message: string, metadata: Record<string, unknown> = {}) {
		this.logger.error(metadata, message);
	}

	public warn(message: string, metadata: Record<string, unknown> = {}) {
		this.logger.warn(metadata, message);
	}

	public debug(message: string, metadata: Record<string, unknown> = {}) {
		this.logger.debug(metadata, message);
	}

	public flushDestination(callback: VoidFunction) {
		this.logger.flush(callback);
	}

	public addToMetadata(appendedMetadata: Record<string, unknown>) {
		this.clsService.set('loggerMetadata', {
			...this.clsService.get('loggerMetadata'),
			...appendedMetadata,
		});
	}
}
