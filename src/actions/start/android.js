import boom from 'boom';
import easycp, { readcp, silentcp } from 'easycp';
import open from 'open';
import ora from 'ora';
import path from 'path';
import { log } from 'reaction-base';
import createConfig from '../../createConfig';
import configureAndroid from '../configure/android';

export default async function startAndroid(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'start',
      defaultEnv: 'development',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await configureAndroid(options, config);
  const spinner = ora('starting android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  setTimeout(async () => {
    easycp(`react-native run-android --port ${config.ports.native}`);
    if (options.storybook) {
      open(`http://localhost:${config.ports.storybookNative}`);
    }
  }, 5000);
  silentcp(`adb reverse tcp:${config.ports.native} tcp:${config.ports.native}`);
  if (options.storybook) {
    silentcp(
      `adb reverse tcp:${config.ports.storybookNative} tcp:${
        config.ports.storybookNative
      }`
    );
    await easycp(
      `storybook start -p ${
        config.ports.storybookNative
      } --config-dir ${path.resolve(__dirname, '../../storybook')}`
    );
  } else {
    await easycp('react-native start --reset-cache');
  }
}
