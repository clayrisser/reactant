import ora from 'ora';
import { log } from 'reaction-base';
import createConfig, { saveConfig } from '../../createConfig';

export default async function configureWeb(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('configuring web\n').start();
  await saveConfig('web', config);
  spinner.succeed('configured web');
}
