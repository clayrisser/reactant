import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import ora from 'ora';
import buildIos from '../build/ios';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishIos(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  const spinner = ora('Publishing ios\n').start();
  await buildIos(options, config);
  if (_.get(config, 'publish.ios')) {
    await Promise.mapSeries(config.publish.ios, async script => {
      await easycp(script);
    });
  }
  spinner.succeed('Published ios');
}
