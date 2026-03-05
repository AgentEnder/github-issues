import { Routes } from '@nestjs/core';

import { HealthModule } from './modules/health/health.module';

export const appRoutes: Routes = [{ path: 'health', module: HealthModule }];
