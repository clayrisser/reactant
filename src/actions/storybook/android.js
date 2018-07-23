import boom from 'boom';
import easycp, { readcp } from 'easycp';
import open from 'open';
import ora from 'ora';
import { log } from 'reaction-base';
import clean from '../clean';
import createConfig, { saveConfig } from '../../createConfig';

export default async function storybookAndroid(options, config) {
  if (!config) {
    config = await createConfig({ action: 'storybook', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  if (options.clean) await clean(options, config);
  const spinner = ora('starting android storybook\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  await saveConfig('android', config);
  spinner.stop();
  setTimeout(async () => {
    await easycp(`react-native run-android --port ${config.ports.native}`);
    open(`http://localhost:${config.ports.storybookNative}`);
  }, 5000);
  await easycp(`storybook start -p ${config.ports.storybookNative}`);
}
