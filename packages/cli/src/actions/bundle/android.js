import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { log } from '@reactant/base';
import clean from '../clean';
import configureAndroid from '../configure/android';
import createConfig from '../../createConfig';

export default async function bundleAndroid(options, config) {
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
  await configureAndroid({ ...options, clean: false }, config);
  const spinner = ora('bundling android\n').start();
  const { paths } = config;
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  await fs.mkdirs(paths.distAndroid);
  spinner.stop();
  await easycp(
    `react-native bundle --entry-file=${path.resolve(
      paths.android,
      'index.js'
    )} --bundle-output=${path.resolve(
      paths.distAndroid,
      'main.jsbundle'
    )} --dev=false --platform=android --assets-dest=${path.resolve(
      paths.distAndroid
    )}`
  );
  spinner.succeed('bundled android');
}
