import _ from 'lodash';
import buildIos from '~/actions/build/ios';
import createConfig from '~/createConfig';
import easycp from 'easycp';
import log from '~/log';

export default async function publishIos(options, config) {
  log.debug('options', options);
  log.info('publishing ios . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildIos(options, config);
  if (_.get(config, 'publish.ios')) {
    for (const script in config.publish.ios) {
      await easycp(script);
    }
  }
}
