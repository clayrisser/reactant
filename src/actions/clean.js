import easycp, { silentcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import createConfig from '../createConfig.js';
import log from '../log';

const { env } = process;

export default async function clean(options, config) {
  if (!config) {
    config = await createConfig({ options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('cleaning').start();
  const { paths } = config;
  await easycp(`rm -rf ${path.resolve(env.TMPDIR || '/tmp', 'react-*')}`);
  await easycp(`rm -rf ${path.resolve(env.TMPDIR || '/tmp', 'metro-*')}`);
  await easycp(`rm -rf ${path.resolve(env.TMPDIR || '/tmp', 'haste-map-*')}`);
  await easycp(`rm -rf ${path.resolve(paths.android, 'build')}`);
  await easycp(`rm -rf ${path.resolve(paths.android, 'app/build')}`);
  await easycp(`rm -rf ${path.resolve(paths.ios, 'build')}`);
  if (options.debug) {
    await easycp('watchman watch-del-all');
  } else {
    await silentcp('watchman watch-del-all');
  }
  fs.removeSync(paths.dist);
  fs.removeSync(path.resolve('.expo'));
  spinner.succeed('cleaned');
}
