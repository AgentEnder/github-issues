import { createFileRoute } from '@tanstack/react-router';

import AuthorizedLayout from '@/components/layouts/AuthorizedLayout';

export const Route = createFileRoute('/_authorized')({
	component: AuthorizedLayout,
});
