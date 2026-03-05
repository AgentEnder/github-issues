import { Controller, Get, HttpCode, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from '@/decorators/public.decorator';
import { routes } from './health.routes';

@Controller({ version: VERSION_NEUTRAL })
export class VersionController {
	@Public()
	@Get(routes.VERSION)
	@HttpCode(HttpStatus.OK)
	public version() {
		return `Portal API Version v${__PACKAGE_VERSION__}`;
	}
}
