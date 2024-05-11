// next.config.mjs
import { resolve } from 'path';

const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
       ...config.resolve.fallback,
        buffer: resolve('node_modules/buffer/'),
        stream: resolve('node_modules/stream-browserify'),
        util: resolve('node_modules/util/'),
        crypto: resolve('node_modules/crypto-browserify'),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );

      config.module.rules.push({
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      });
    }
    return config;
  },
};

export default nextConfig;
