import ora from 'ora';
import { log } from '@reactant/base';
import clean from '../clean';
import createConfig from '../../createConfig';

export default async function configureIos(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('configuring ios\n').start();
  if (options.clean) await clean(options, config);
  spinner.succeed('configured ios');
}
