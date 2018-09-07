import ora from 'ora';
import clean from '../clean';
import { loadConfig } from '../../config';

export default async function configureAndroid(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('configuring android\n').start();
  if (options.clean) await clean(options);
  spinner.succeed('configured android');
}
