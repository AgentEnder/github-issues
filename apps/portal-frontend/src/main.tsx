import { ThemeProvider } from 'next-themes';
import { StrictMode } from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import App from './App';
import ErrorPageFallback from './components/ui/ErrorPageFallback';
import LocaleProvider from './providers/Locale';

// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const rootElement = document.getElementById('root') as HTMLDivElement;

const ErrorBoundaryFallbackComponent = (props: FallbackProps) => <ErrorPageFallback error={props.error} />;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<StrictMode>
			<CookiesProvider defaultSetOptions={{ path: '/' }}>
				<ThemeProvider attribute="class">
					<LocaleProvider>
						<ErrorBoundary FallbackComponent={ErrorBoundaryFallbackComponent}>
							<App />
						</ErrorBoundary>
					</LocaleProvider>
				</ThemeProvider>
			</CookiesProvider>
		</StrictMode>,
	);
}
