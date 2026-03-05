import { createRootRoute, Navigate, Outlet } from '@tanstack/react-router';

import ErrorPageFallback from '@/components/ui/ErrorPageFallback';

export const Route = createRootRoute({
	component: () => <Outlet />,
	notFoundComponent: () => <Navigate to="/" />,
	errorComponent: (props) => <ErrorPageFallback error={props.error} />,
});
