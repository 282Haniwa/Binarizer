/*eslint-env node*/
const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias = {
      src: path.join(__dirname, 'src/'),
      lib: path.join(__dirname, 'lib/'),
    };
    return config;
  },
};
