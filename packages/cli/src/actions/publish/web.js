import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import ora from 'ora';
import buildWeb from '../build/web';
import { loadConfig } from '../../config';

export default async function publishWeb(options) {
  const config = loadConfig({
    action: 'publish',
    defaultEnv: 'production',
    options
  });
  const spinner = ora('publishing web').start();
  await buildWeb(options);
  if (_.get(config, 'publish.web')) {
    await Promise.mapSeries(config.publish.web, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('published web');
}
