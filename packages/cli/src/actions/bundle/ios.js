import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { log } from '@reactant/base';
import clean from '../clean';
import configureIos from '../configure/ios';
import createConfig from '../../createConfig';

export default async function bundleIos(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'bundle',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  await configureIos({ ...options, clean: false }, config);
  const spinner = ora('bundling ios\n').start();
  const { paths } = config;
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  fs.mkdirsSync(paths.distIos);
  spinner.stop();
  await easycp(
    `react-native bundle --entry-file=${path.resolve(
      paths.ios,
      'index.js'
    )} --bundle-output=${path.resolve(
      paths.distIos,
      'main.jsbundle'
    )} --dev=false --platform=ios --assets-dest=${path.resolve(paths.distIos)}`
  );
  spinner.succeed('bundled ios');
}
