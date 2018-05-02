import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import ora from 'ora';
import buildWeb from '../build/web';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishWeb(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Publishing web').start();
  await buildWeb(options, config);
  if (_.get(config, 'publish.web')) {
    await Promise.mapSeries(config.publish.web, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('Published web');
}
