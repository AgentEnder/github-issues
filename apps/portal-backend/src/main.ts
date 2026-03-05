import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';
import helmet from 'helmet';
import { type NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

import { LoggerService } from '@/libs/logger/logger.service';

import { AppModule } from './app.module';
import type { ConfigurationInterface } from './helpers/config/configuration.interface';

// * "bufferLogs" is used in order to log all bootstrap logs with the custom logger
const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
	bufferLogs: true,
	forceCloseConnections: true,
});

const configService = app.get<ConfigService<ConfigurationInterface, true>>(ConfigService);

app.use(helmet());

app.enableVersioning({
	type: VersioningType.URI,
	defaultVersion: __MAJOR_PACKAGE_VERSION__,
});

const loggerService = app.get(LoggerService);

process.on('unhandledRejection', (error) => {
	loggerService.error('Unhandled Rejection', { error });

	void app.close();
});

process.on('uncaughtException', (error) => {
	loggerService.error('Unhandled Exception', { error });

	void app.close();
});

app.useLogger(loggerService);

// ! - Do not add "app.enableShutdownHooks();" code because the package "nestjs-graceful-shutdown" does it
setupGracefulShutdown({ app });

const corsOriginFrontendUrl = configService.get('corsOriginFrontendUrl', { infer: true });

app.enableCors({ origin: corsOriginFrontendUrl });

const port = configService.get('port', { infer: true });

const server = await app.listen(port);

// * Why: https://michaelguay.dev/optimizing-nestjs-performance-with-http-keep-alive/
server.keepAliveTimeout = 61_000;
server.headersTimeout = 62_000;
