import easycp from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startExpo(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Starting expo\n').start();
  await clean(options, config);
  await easycp('adb reverse tcp:19000 tcp:19000 || true');
  setTimeout(() => {
    spinner.stop();
  }, 10000);
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
