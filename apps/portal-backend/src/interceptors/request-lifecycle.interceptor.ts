import { performance } from 'node:perf_hooks';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { type Observable, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import type { FastifyRequest, FastifyReply } from 'fastify';

import { LoggerService } from '@/libs/logger/logger.service';
import type { ConfigurationInterface } from '@/helpers/config/configuration.interface';
import { AsyncStorageStore } from '@/helpers/async-storage/types/store';

@Injectable()
export class RequestLifecycleInterceptor implements NestInterceptor {
	constructor(
		private readonly loggerService: LoggerService,
		private readonly configService: ConfigService<ConfigurationInterface, true>,
		private readonly clsService: ClsService<AsyncStorageStore>,
	) {}

	public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<FastifyRequest>();

		const nodeEnv = this.configService.get('nodeEnv', { infer: true });

		if (nodeEnv !== 'development' && request.url.startsWith('/health')) {
			return next.handle();
		}

		this.loggerService.addToMetadata({ requestRoute: request.url });
		this.loggerService.log('Start handling request', {
			requestParams: request.params,
			requestQuery: request.query,
		});

		const beforeOverallRequest = performance.now();

		this.clsService.set('beforeOverallRequest', beforeOverallRequest);

		return next.handle().pipe(
			tap(() => {
				const afterOverallRequest = performance.now();
				const requestOverallDuration = afterOverallRequest - beforeOverallRequest;
				const response = context.switchToHttp().getResponse<FastifyReply>();

				this.loggerService.log('Finished handling request', {
					requestOverallDuration,
					responseStatusCode: response.statusCode,
				});
			}),
		);
	}
}
