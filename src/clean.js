import fs from 'fs-extra';
import createConfig from './createConfig.js';
import log from './log';

export default function clean(options, config) {
  log.info('cleaning . . .');
  if (!config) {
    config = createConfig({});
  }
  const { paths } = config;
  fs.emptyDirSync(paths.dist);
}
