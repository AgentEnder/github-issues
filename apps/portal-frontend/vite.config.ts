import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { watchI18NPlugin } from './plugins/watch-i18n';

const viteConfig = defineConfig({
	base: '/',
	server: { port: 8080 },
	build: { outDir: './dist' },
	plugins: [
		watchI18NPlugin(),
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
			generatedRouteTree: './src/generated-route-tree.ts',
		}),
		react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
		tsconfigPaths(),
		tailwindcss(),
		devtools(),
	],
	preview: { port: 8080, open: true },
});

export default viteConfig;
