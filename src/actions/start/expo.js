import boom from 'boom';
import easycp, { readcp, silentcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

export default async function startExpo(options, config) {
  if (!config) {
    config = await createConfig({ defaultEnv: 'development', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const spinner = ora('starting expo\n').start();
  await saveConfig('expo', config);
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  if ((await readcp('which adb')).length) {
    await silentcp('adb reverse tcp:19000 tcp:19000');
  }
  spinner.stop();
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
