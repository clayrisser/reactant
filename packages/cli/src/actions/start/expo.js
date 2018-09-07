import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import configureExpo from '../configure/expo';
import { loadConfig } from '../../config';

export default async function startExpo(options) {
  loadConfig({
    action: 'start',
    defaultEnv: 'development',
    options
  });
  await configureExpo(options);
  const spinner = ora('starting expo\n').start();
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  spinner.stop();
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
