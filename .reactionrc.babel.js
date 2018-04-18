import { log } from './tools/lib';

export default {
  title: 'Reaction',
  webpack: (config, webpack) => {
    if (webpack.target === 'web') {
      log.info(webpack);
    }
    webpack.mode = 'production';
    return webpack;
  }
};
