const { composePlugins } = require('@nrwl/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(require('./webpack.config'), (config) => {
  // Update the webpack config as needed here.
  process.env.BABEL_ENV = 'production';
  return config;
});
