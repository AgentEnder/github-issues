import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ClsModule } from 'nestjs-cls';
import { ZodValidationPipe } from 'nestjs-zod';

import { LoggerModule } from '@/libs/logger/logger.module';
import { LoggerService } from '@/libs/logger/logger.service';

import { getConfiguration } from './helpers/config/configuration';
import { validateConfiguration } from './helpers/config/configuration.validation';
import { appRoutes } from './app.routes';
import { HealthModule } from './modules/health/health.module';
import { AllExceptionsFilter } from './exceptions-filters/all-exceptions.filter';
import { RequestLifecycleInterceptor } from './interceptors/request-lifecycle.interceptor';
import { setupAsyncStorageFactory } from './helpers/async-storage/setup';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';

@Module({
	imports: [
		// * Configurations
		RouterModule.register(appRoutes),
		ConfigModule.forRoot({
			load: [getConfiguration],
			isGlobal: true,
			cache: true,
			validate: validateConfiguration,
			validationOptions: { allowUnknown: false, abortEarly: true },
		}),
		GracefulShutdownModule.forRoot({
			cleanup: async (app) => {
				const loggerService = app.get(LoggerService);

				loggerService.debug('Running clean up');

				await new Promise<void>((resolve) => {
					loggerService.flushDestination(() => {
						resolve();
					});
				});
			},
		}),

		// * Utilities
		ClsModule.forRootAsync({
			global: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: setupAsyncStorageFactory,
		}),
		LoggerModule,

		// * Exposed HTTP modules
		HealthModule,
	],
	providers: [
		{ provide: APP_FILTER, useClass: AllExceptionsFilter },
		{ provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: RequestLifecycleInterceptor },
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
	],
})
export class AppModule {}
