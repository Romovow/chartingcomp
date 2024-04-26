// next.config.mjs
import { resolve } from 'path';

const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Provide polyfills for node modules used by dependencies
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: resolve('node_modules/buffer/'),
        stream: resolve('node_modules/stream-browserify'),
        util: resolve('node_modules/util/'),
        crypto: resolve('node_modules/crypto-browserify'),
      };

      // Provide global variables needed by some modules
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    return config;
  },
};

export default nextConfig;
