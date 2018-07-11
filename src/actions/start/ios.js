import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

export default async function startIos(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const spinner = ora('Starting ios\n').start();
  await saveConfig('ios', config);
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  easycp(`react-native run-ios --port ${config.ports.native}`);
}
