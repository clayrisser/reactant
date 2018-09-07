import ora from 'ora';
import clean from '../clean';
import { loadConfig, saveConfig } from '../../config';

export default async function configureExpo(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('configuring expo\n').start();
  if (options.clean) await clean(options);
  saveConfig('expo');
  spinner.succeed('configured expo');
}
