import easycp from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startIos(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Starting ios\n').start();
  await clean(options, config);
  await easycp('adb reverse tcp:8081 tcp:8081');
  setTimeout(async () => {
    spinner.stop();
    easycp('react-native run-ios');
  }, 5000);
  await easycp('react-native start --reset-cache');
}
