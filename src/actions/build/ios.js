import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { log } from 'reaction-base';
import clean from '../clean';
import configureIos from '../configure/ios';
import createConfig from '../../createConfig';

export default async function buildIos(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  await configureIos(options, config);
  const spinner = ora('building ios\n').start();
  const { paths } = config;
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  fs.mkdirsSync(paths.distIos);
  await easycp(
    `react-native bundle --entry-file=${path.resolve(
      paths.ios,
      'index.js'
    )} --bundle-output=${path.resolve(
      paths.distIos,
      'main.jsbundle'
    )} --dev=false --platform=ios --assets-dest=${path.resolve(paths.distIos)}`
  );
  await easycp(
    `react-native run-ios --configuration Release ${
      options.simulator ? ` --simulator ${options.simulator}` : ''
    }${options.device ? ` --device ${options.device}` : ''}`
  );
  spinner.succeed('built ios');
}
