declare const __PACKAGE_VERSION__: string;
declare const __MAJOR_PACKAGE_VERSION__: string;

declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_ENV: string;
		readonly PORT: string;
		readonly CORS_ORIGIN_FRONTEND_URL: string;
	}
}
