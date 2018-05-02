import easycp from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Building android\n').start();
  await clean(options, config);
  await easycp('react-native bundle');
  spinner.succeed('Built android');
}
