import easycp, { silentcp } from 'easycp';
import fs from 'fs-extra';
import createConfig from '../createConfig.js';
import log from '../log';

export default async function clean(options, config) {
  if (!config) {
    config = createConfig({ options });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: CLEAN :::');
  const { paths } = config;
  await easycp('rm -rf /tmp/metro-bundler-cache-* || true');
  await easycp('rm -rf /tmp/haste-map-react-native-packager-* || true');
  if (options.debug) {
    await easycp('watchman watch-del-all');
  } else {
    await silentcp('watchman watch-del-all');
  }
  fs.emptyDirSync(paths.dist);
}
