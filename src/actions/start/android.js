import boom from 'boom';
import easycp, { readcp, silentcp } from 'easycp';
import open from 'open';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

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
  if (options.clean) await clean(options, config);
  const spinner = ora('starting android\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  await saveConfig('android', config);
  spinner.stop();
  setTimeout(async () => {
    easycp(`react-native run-android --port ${config.ports.native}`);
    silentcp(
      `adb reverse tcp:${config.ports.native} tcp:${config.ports.native}`
    );
    if (options.storybook) {
      silentcp(
        `adb reverse tcp:${config.ports.storybookNative} tcp:${
          config.ports.storybookNative
        }`
      );
      open(`http://localhost:${config.ports.storybookNative}`);
    }
  }, 5000);
  if (options.storybook) {
    await easycp(`storybook start -p ${config.ports.storybookNative}`);
  } else {
    await easycp('react-native start --reset-cache');
  }
}
