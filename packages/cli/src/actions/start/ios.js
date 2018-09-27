import boom from 'boom';
import easycp, { readcp } from 'easycp';
// import open from 'open';
import openTerminal from 'open-terminal';
import ora from 'ora';
import path from 'path';
import configureIos from '../configure/ios';
import { loadConfig } from '../../config';

export default async function startIos(options) {
  const config = loadConfig({
    action: 'start',
    defaultEnv: 'development',
    options
  });
  await configureIos(options);
  const spinner = ora('Starting ios\n').start();
  if (!(await readcp('which react-native')).length) {
    spinner.stop();
    throw boom.badRequest('react-native not installed');
  }
  spinner.stop();
  setTimeout(async () => {
    openTerminal(
      `react-native run-ios --port ${config.ports.native} ${
        options.simulator ? ` --simulator ${options.simulator}` : ''
      }${options.device ? ` --device ${options.device}` : ''}`,
      { cwd: config.paths.root }
    );
    // easycp(
    //   `react-native run-ios --port ${config.ports.native} ${
    //     options.simulator ? ` --simulator ${options.simulator}` : ''
    //   }${options.device ? ` --device ${options.device}` : ''}`
    // );
    // open(
    //   `http://localhost:${
    //     options.storybook ? config.ports.storybookNative : config.ports.native
    //   }`
    // );
  }, 5000);
  if (options.storybook) {
    await easycp(
      `storybook start -p ${
        config.ports.storybookNative
      } --config-dir ${path.resolve(__dirname, '../../storybook')}`
    );
  } else {
    // const haulBin = resolveModulePath('haul/bin/cli', '../../..');
    const haulBin = require.resolve('haul/bin/cli');
    await easycp(
      `node ${haulBin} start --port ${config.ports.native}${
        config.options.debug ? ' --debug' : ''
      } --platform ios --config ${path.resolve(
        __dirname,
        '../../webpack/haul.js'
      )}`
    );
  }
}
