import easycp from 'easycp';
import ora from 'ora';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildExpo(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('building expo\n').start();
  await clean(options, config);
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
