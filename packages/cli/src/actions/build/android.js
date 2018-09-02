import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import { log } from '@reactant/base';
import bundleAndroid from '../bundle/android';
import createConfig from '../../createConfig';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await bundleAndroid(options, config);
  const spinner = ora('building android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  await easycp(
    `react-native run-android --configuration Release ${
      options.simulator ? ` --simulator ${options.simulator}` : ''
    }${options.device ? ` --device ${options.device}` : ''}`
  );
  spinner.succeed('built android');
}
