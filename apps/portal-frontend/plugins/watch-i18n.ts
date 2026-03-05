import path from 'node:path';

import spawnAsync from '@expo/spawn-async';
import type { Plugin } from 'vite';

const directoryToWatch = path.join(path.dirname(import.meta.dirname), 'src', 'i18n', 'locales');

export const watchI18NPlugin = (): Plugin => {
	let isAlreadyRunning = false;

	return {
		name: 'vite-watch-i18n',
		apply: 'serve',
		configureServer: (server) => {
			const watcher = server.watcher.add(directoryToWatch);

			watcher.on('change', async () => {
				if (isAlreadyRunning) {
					return;
				}

				isAlreadyRunning = true;

				console.log('🌐 Detected change in i18n files. Regenerating type-safe resources...');

				try {
					const { stderr } = await spawnAsync('nx', ['run', 'portal-frontend:i18n-type-safe'], {
						timeout: 15_000,
					});

					if (stderr) {
						throw stderr;
					}

					console.log('🌐 Successfully generated type-safe resources');
				} catch (error) {
					console.error(
						`🌐 Failed to execute regeneration type-safe resources with an error: ${error}`,
					);
				}

				isAlreadyRunning = false;
			});
		},
	};
};
