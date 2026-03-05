import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';

import DevToolsProvider from './providers/DevTools';
import { router } from './router';
import { defaultQueryFunction } from './services/http';

const queryClient = new QueryClient({ defaultOptions: { queries: { queryFn: defaultQueryFunction } } });

const App = () => (
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />

		<DevToolsProvider />
	</QueryClientProvider>
);

export default App;
