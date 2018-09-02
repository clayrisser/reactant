import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import { log } from '@reactant/base';
import clean from '../clean';
import configureExpo from '../configure/expo';
import createConfig from '../../createConfig';

export default async function buildExpo(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await clean(options, config);
  await configureExpo({ ...options, clean: false }, config);
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
