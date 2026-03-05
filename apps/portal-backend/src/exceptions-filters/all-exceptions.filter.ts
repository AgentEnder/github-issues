import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { serializeError } from 'serialize-error';
import { HttpAdapterHost } from '@nestjs/core';

import { LoggerService } from '@/libs/logger/logger.service';
import type { AsyncStorageStore } from '@/helpers/async-storage/types/store';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly clsService: ClsService<AsyncStorageStore>,
		private readonly loggerService: LoggerService,
	) {}

	// * This method handles errors that weren't thrown explicitly
	private processUnboundedError(exception: unknown) {
		if (exception instanceof Error) {
			this.loggerService.error('Server unbounded error', {
				error: serializeError(exception),
				responseStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			});
		} else {
			this.loggerService.error('Server unbounded error', {
				error: exception,
				responseStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			});
		}

		const requestId = this.clsService.getId();

		return {
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			body: { requestId },
		};
	}

	private processBoundedError(exception: HttpException) {
		const exceptionStatusCode = exception.getStatus();

		// * Skip logging for not found endpoints in the server
		if (!exception.message.startsWith('Cannot ')) {
			this.loggerService.error('Server bounded error', {
				responseStatusCode: exceptionStatusCode,
				errorMessage: exception.message,
			});
		}

		const requestId = this.clsService.getId();

		// * Don't expose the customer with the underlying error
		// oxlint-disable-next-line typescript/no-unsafe-enum-comparison
		if (exceptionStatusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				body: { requestId },
			};
		}

		return {
			status: exceptionStatusCode,
			body: { requestId },
		};
	}

	public catch(exception: unknown, host: ArgumentsHost) {
		const responseData =
			exception instanceof HttpException
				? this.processBoundedError(exception)
				: this.processUnboundedError(exception);

		const context = host.switchToHttp();

		this.httpAdapterHost.httpAdapter.reply(context.getResponse(), responseData.body, responseData.status);
	}
}
