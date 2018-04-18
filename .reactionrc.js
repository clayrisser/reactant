import { log } from './tools/lib';

export default {
  webpack: (config, webpack) => {
    if (webpack.target === 'web') {
      log.info(webpack);
    }
    webpack.mode = 'production';
    return webpack;
  }
};
