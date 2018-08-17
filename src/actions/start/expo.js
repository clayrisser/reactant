import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import { log } from 'reaction-base';
import createConfig from '../../createConfig';
import configureExpo from '../configure/expo';

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
  await configureExpo(options, config);
  const spinner = ora('starting expo\n').start();
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  spinner.stop();
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
