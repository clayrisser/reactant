import boom from 'boom';
import easycp, { readcp } from 'easycp';
import ora from 'ora';
import bundleIos from '../bundle/ios';
import { loadConfig } from '../../config';

export default async function buildIos(options) {
  loadConfig({
    action: 'build',
    defaultEnv: 'production',
    options
  });
  await bundleIos(options);
  const spinner = ora('building ios\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  await easycp(
    `react-native run-ios --configuration Release ${
      options.simulator ? ` --simulator ${options.simulator}` : ''
    }${options.device ? ` --device ${options.device}` : ''}`
  );
  spinner.succeed('built ios');
}
