import boom from 'boom';
import easycp, { readcp } from 'easycp';
import fs from 'fs-extra';
// import open from 'open';
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
  // setTimeout(async () => {
  //   easycp(
  //     `react-native run-ios --port ${config.ports.native} ${
  //       options.simulator ? ` --simulator ${options.simulator}` : ''
  //     }${options.device ? ` --device ${options.device}` : ''}`
  //   );
  //   open(
  //     `http://localhost:${
  //       options.storybook ? config.ports.storybookNative : config.ports.native
  //     }`
  //   );
  // }, 5000);
  if (options.storybook) {
    await easycp(
      `storybook start -p ${
        config.ports.storybookNative
      } --config-dir ${path.resolve(__dirname, '../../storybook')}`
    );
  } else {
    let haulBin = path.resolve(
      __dirname,
      '../../../node_modules/haul/bin/cli.js'
    );
    if (!fs.existsSync(haulBin)) {
      haulBin = path.resolve(__dirname, '../../../../../haul/bin/cli.js');
    }
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
