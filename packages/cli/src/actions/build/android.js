import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import bundleAndroid from '../bundle/android';
import { loadConfig } from '../../config';

export default async function buildAndroid(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  await bundleAndroid(options);
  const spinner = ora('building android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  await easycp(
    `react-native run-android --configuration Release ${
      options.simulator ? ` --simulator ${options.simulator}` : ''
    }${options.device ? ` --device ${options.device}` : ''}`
  );
  spinner.succeed('built android');
}
