import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import buildIos from '../build/ios';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishIos(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: PUBLISH IOS :::');
  await buildIos(options, config);
  if (_.get(config, 'publish.ios')) {
    await Promise.mapSeries(config.publish.ios, async script => {
      await easycp(script);
    });
  }
}
