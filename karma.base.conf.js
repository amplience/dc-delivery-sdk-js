var webpack = require('webpack');

module.exports = {
  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',

  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha'],

  files: [
    'build/module/**/*.js'
  ],

  // list of files to exclude
  exclude: [],

  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    "build/module/**/*.js": ['webpack']
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  // Disable code coverage, as it's breaking CI:
  // reporters: ['dots', 'coverage', 'saucelabs'],
  reporters: ['dots'],

  // web server port
  port: 9876,

  // Increase timeouts to prevent the issue with disconnected tests (https://goo.gl/nstA69)
  captureTimeout: 4 * 60 * 1000,
  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 1,
  browserNoActivityTimeout: 4 * 60 * 1000,

  // enable / disable colors in the output (reporters and logs)
  colors: true,

  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: false,

  // Webpack config
  webpack: {
    mode: 'production',
    cache: true,
    devtool: 'inline-source-map',
    externals: [{}],
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
                    browsers: ['last 2 versions', 'not dead']
                  },
                  useBuiltIns: 'usage',
                  corejs: { version: 3, proposals: true }
                }
              ]
            ],
            plugins: [
              ["@babel/plugin-transform-for-of", {
                assumeArray: true
              }],
              ["@babel/plugin-transform-classes", {
                loose: true
              }]
            ]
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('test')
      })
    ]
  },

  webpackServer: {
    stats: {
      colors: true
    }
  }
};
