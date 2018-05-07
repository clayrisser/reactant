import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startAndroid(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('starting android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  if (options.clean) await clean(options, config);
  if ((await readcp('which adb')).length) {
    await easycp(`adb reverse tcp:8081 tcp:${config.ports.native} || true`);
  }
  setTimeout(async () => {
    spinner.stop();
    easycp(`react-native run-android --port ${config.ports.native}`);
  }, 5000);
  await easycp('react-native start --reset-cache');
}
