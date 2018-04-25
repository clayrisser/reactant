import Promise from 'bluebird';
import _ from 'lodash';
import easycp from 'easycp';
import buildAndroid from '../build/android';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: PUBLISH ANDROID :::');
  await buildAndroid(options, config);
  if (_.get(config, 'publish.android')) {
    await Promise.mapSeries(config.publish.android, async script => {
      await easycp(script);
    });
  }
}
