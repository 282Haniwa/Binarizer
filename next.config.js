/*eslint-env node*/
const path = require('path');

module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.join(__dirname, 'src/'),
      lib: path.join(__dirname, 'lib/'),
    };
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        // inline: true,
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });
    // Overcome webpack referencing `window` in chunks
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    return config;
  },
};
