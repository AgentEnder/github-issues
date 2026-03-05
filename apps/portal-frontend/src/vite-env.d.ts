/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
	readonly VITE_BACKEND_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
