import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import ora from 'ora';
import buildAndroid from '../build/android';
import { loadConfig } from '../../config';

export default async function publishAndroid(options) {
  const config = loadConfig({
    action: 'publish',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('publishing android\n').start();
  await buildAndroid(options);
  if (_.get(config, 'publish.android')) {
    await Promise.mapSeries(config.publish.android, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published android');
}
