const baseConfig = require('./karma.base.conf.js')

module.exports = function (config) {
  config.set({
    ...baseConfig,

    browsers: ['Firefox', 'Chrome', 'Safari']
  });
};
