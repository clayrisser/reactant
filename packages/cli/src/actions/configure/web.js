import ora from 'ora';
import clean from '../clean';
import { loadConfig } from '../../config';

export default async function configureWeb(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('configuring web\n').start();
  if (options.clean) await clean(options);
  spinner.succeed('configured web');
}
