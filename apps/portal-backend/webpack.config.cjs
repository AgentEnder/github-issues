const path = require('node:path');

const nodeExternals = require('webpack-node-externals');

const { version } = require('./package.json');

/**
 * @type {(options: import('webpack').Configuration, webpack: import('webpack')) => import('webpack').Configuration}
 */
const configuration = (options, webpack) => {
	const plugins = [
		...options.plugins,
		new webpack.DefinePlugin({
			__PACKAGE_VERSION__: JSON.stringify(version),
			__MAJOR_PACKAGE_VERSION__: JSON.stringify(version.split('.')[0]),
		}),
	];

	return {
		...options,
		externals: [
			nodeExternals({
				modulesDir: path.join(__dirname, 'node_modules'),
				importType: (moduleName) => `import ${moduleName}`,
			}),
		],
		plugins,
		experiments: { outputModule: true },
		output: {
			filename: 'main.js',
			path: path.resolve(__dirname, 'dist'),
			library: { type: 'module' },
			chunkFormat: 'module',
		},
	};
};

module.exports = configuration;
