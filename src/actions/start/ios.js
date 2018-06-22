import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startIos(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Starting ios\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  if (options.clean) await clean(options, config);
  spinner.stop();
  easycp(`react-native run-ios --port ${config.ports.native}`);
}
