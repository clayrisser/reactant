import _ from 'lodash';
import buildAndroid from '~/actions/build/android';
import createConfig from '~/createConfig';
import easycp from 'easycp';
import log from '~/log';

export default async function publishAndroid(options, config) {
  log.debug('options', options);
  log.info('publishing android . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildAndroid(options, config);
  if (_.get(config, 'publish.android')) {
    for (const script in config.publish.android) {
      await easycp(script);
    }
  }
}
