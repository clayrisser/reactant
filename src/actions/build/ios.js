import boom from 'boom';
import easycp, { readcp } from 'easycp';
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
  await easycp(
    `react-native bundle --entry-file ${path.resolve(
      paths.ios,
      'index.js'
    )} --bundle-output ${path.resolve(
      paths.distIos,
      `${config.moduleName}.bundle`
    )}`
  );
  spinner.succeed('built ios');
}
