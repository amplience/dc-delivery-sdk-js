const webpack = require('webpack');
const path = require('path');

function bundleConfig(name) {
  const isLegacy = name.indexOf('legacy') !== -1;
  const browserTargets = isLegacy
    ? ['last 5 versions', 'ie >= 10']
    : ['last 2 versions', 'not dead'];

  const config = {
    entry: path.resolve(__dirname, 'build/module/index.js'),
    resolve: {
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: browserTargets,
                  },
                  useBuiltIns: 'usage',
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
            plugins: [
              [
                '@babel/plugin-transform-for-of',
                {
                  assumeArray: true,
                },
              ],
              [
                '@babel/plugin-transform-classes',
                {
                  loose: true,
                },
              ],
            ],
          },
        },
      ],
    },
    output: {
      filename: `${name}.js`,
      path: path.resolve(__dirname, 'dist'),
      sourceMapFilename: `${name}.map`,
      libraryTarget: 'umd',
      library: 'ampDynamicContent',
    },
    devtool: 'source-map',
  };

  if (name.indexOf('min') !== -1) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }

  return config;
}

module.exports = [
  'dynamicContent.browser.umd',
  'dynamicContent.browser.umd.legacy',
]
  .map((name) => (process.env.NODE_ENV === 'production' ? name + '.min' : name))
  .map((name) => bundleConfig(name));
