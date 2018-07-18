import boom from 'boom';
import easycp, { readcp, silentcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

export default async function startAndroid(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'start',
      defaultEnv: 'development',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const spinner = ora('starting android\n').start();
  await saveConfig('android', config);
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  setTimeout(async () => {
    easycp(`react-native run-android --port ${config.ports.native}`);
  }, 5000);
  await easycp('react-native start --reset-cache');
}
