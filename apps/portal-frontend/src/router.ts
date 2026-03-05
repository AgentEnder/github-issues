import { createRouter } from '@tanstack/react-router';

import { routeTree } from './generated-route-tree';

export const router = createRouter({ routeTree, notFoundMode: 'root' });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
