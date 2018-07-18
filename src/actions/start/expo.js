import boom from 'boom';
import easycp, { readcp, silentcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

export default async function startExpo(options, config) {
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
  const spinner = ora('starting expo\n').start();
  await saveConfig('expo', config);
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  spinner.stop();
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
