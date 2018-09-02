import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import bundleIos from '../bundle/ios';
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
  await bundleIos(options, config);
  const spinner = ora('building ios\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  await easycp(
    `react-native run-ios --configuration Release ${
      options.simulator ? ` --simulator ${options.simulator}` : ''
    }${options.device ? ` --device ${options.device}` : ''}`
  );
  spinner.succeed('built ios');
}
