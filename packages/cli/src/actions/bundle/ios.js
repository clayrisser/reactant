import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import configureIos from '../configure/ios';
import { loadConfig } from '../../config';

export default async function bundleIos(options) {
  const config = loadConfig({
    action: 'bundle',
    defaultEnv: 'production',
    options
  });
  const { paths } = config;
  await configureIos(options);
  const spinner = ora('bundling ios\n').start();
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
