import {
	CallHandler,
	ExecutionContext,
	GatewayTimeoutException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
	public intercept(_context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			timeout(30_000),
			catchError((error) => {
				if (error instanceof TimeoutError) {
					return throwError(() => new GatewayTimeoutException());
				}

				return throwError(() => error);
			}),
		);
	}
}
