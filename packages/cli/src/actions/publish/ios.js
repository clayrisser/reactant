import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { log } from 'reaction-base';
import buildIos from '../build/ios';
import createConfig from '../../createConfig';

export default async function publishIos(options, config) {
  if (!config) {
    config = await createConfig({
      action: 'build',
      defaultEnv: 'production',
      options
    });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('publishing ios\n').start();
  const configPath = path.resolve('../../../../../ios/config.json');
  await fs.writeJson(configPath, config);
  await buildIos(options, config);
  if (_.get(config, 'publish.ios')) {
    await Promise.mapSeries(config.publish.ios, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published ios');
}
