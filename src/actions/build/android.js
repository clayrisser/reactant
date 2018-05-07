import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('building android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  await clean(options, config);
  await easycp('react-native bundle');
  spinner.succeed('built android');
}
