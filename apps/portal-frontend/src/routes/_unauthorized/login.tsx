import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_unauthorized/login')({
	component: () => <div>HEY Login</div>,
});
