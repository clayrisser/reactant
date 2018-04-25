import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import buildWeb from '../build/web';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishWeb(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: PUBLISH WEB :::');
  await buildWeb(options, config);
  if (_.get(config, 'publish.web')) {
    await Promise.mapSeries(config.publish.web, async script => {
      await easycp(script);
    });
  }
}
