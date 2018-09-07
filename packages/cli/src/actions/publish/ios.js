import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import buildIos from '../build/ios';
import { loadConfig } from '../../config';

export default async function publishIos(options) {
  const config = loadConfig({
    action: 'publish',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('publishing ios\n').start();
  const configPath = path.resolve('../../../../../ios/config.json');
  await fs.writeJson(configPath, config);
  await buildIos(options);
  if (_.get(config, 'publish.ios')) {
    await Promise.mapSeries(config.publish.ios, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published ios');
}
