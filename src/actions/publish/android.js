import _ from 'lodash';
import buildAndroid from '~/actions/build/android';
import createConfig from '~/createConfig';
import easycp from 'easycp';
import log from '~/log';
import Promise from 'bluebird';

export default async function publishAndroid(options, config) {
  log.debug('options', options);
  log.info('publishing android . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildAndroid(options, config);
  if (_.get(config, 'publish.android')) {
    await Promise.mapSeries(config.publish.android, async script => {
      await easycp(script);
    });
  }
}
