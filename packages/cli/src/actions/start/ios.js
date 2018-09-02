import boom from 'boom';
import easycp, { readcp } from 'easycp';
import open from 'open';
import ora from 'ora';
import path from 'path';
import { log } from '@reactant/base';
import createConfig from '../../createConfig';
import configureIos from '../configure/ios';

export default async function startIos(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'start',
      defaultEnv: 'development',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  await configureIos(options, config);
  const spinner = ora('Starting ios\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  if (options.storybook) {
    setTimeout(async () => {
      easycp(`react-native run-ios --port ${config.ports.native}`);
      open(`http://localhost:${config.ports.storybookNative}`);
    }, 5000);
    await easycp(
      `storybook start -p ${
        config.ports.storybookNative
      } --config-dir ${path.resolve(__dirname, '../../storybook')}`
    );
  } else {
    easycp(
      `react-native run-ios --port ${config.ports.native} ${
        options.simulator ? ` --simulator ${options.simulator}` : ''
      }${options.device ? ` --device ${options.device}` : ''}`
    );
  }
}
