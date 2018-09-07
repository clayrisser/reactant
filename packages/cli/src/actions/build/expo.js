import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import configureExpo from '../configure/expo';
import { loadConfig } from '../../config';

export default async function buildExpo(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  await configureExpo(options);
  const spinner = ora('building expo\n').start();
  if (!(await readcp('which exp')).length) {
    spinner.stop();
    throw boom.badRequest('exp not installed');
  }
  await easycp('exp build:android');
  switch (options.expoPlatform) {
    case 'android':
      await easycp('exp build:android');
      break;
    case 'ios':
      await easycp('exp build:ios');
      break;
    default:
      await easycp('exp build:android');
      await easycp('exp build:ios');
      break;
  }
  spinner.succeed('built expo');
}
