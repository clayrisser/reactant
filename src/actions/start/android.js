import easycp from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('starting android\n').start();
  if (options.clean) await clean(options, config);
  await easycp('adb reverse tcp:8081 tcp:8081 || true');
  setTimeout(async () => {
    spinner.stop();
    easycp('react-native run-android');
  }, 5000);
  await easycp('react-native start --reset-cache');
}
