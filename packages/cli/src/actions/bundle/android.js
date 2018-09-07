import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import configureAndroid from '../configure/android';
import { loadConfig } from '../../config';

export default async function bundleAndroid(options) {
  const config = loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  const { paths } = config;
  await configureAndroid(options);
  const spinner = ora('bundling android\n').start();
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
