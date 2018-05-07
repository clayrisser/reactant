import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startExpo(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('starting expo\n').start();
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  if (options.clean) await clean(options, config);
  if ((await readcp('which adb')).length) {
    await easycp('adb reverse tcp:19000 tcp:19000 || true');
  }
  setTimeout(() => {
    spinner.stop();
  }, 10000);
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
