import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { router } from '@/router';

const DevToolsProvider = () => (
	<TanStackDevtools
		config={{ hideUntilHover: true }}
		plugins={[
			{
				name: 'TanStack Query',
				render: <ReactQueryDevtoolsPanel />,
				defaultOpen: true,
			},
			{
				name: 'TanStack Router',
				render: <TanStackRouterDevtoolsPanel router={router} />,
				defaultOpen: false,
			},
		]}
	/>
);

export default DevToolsProvider;
