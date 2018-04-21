import _ from 'lodash';
import buildWeb from '~/actions/build/web';
import createConfig from '~/createConfig';
import easycp from 'easycp';
import log from '~/log';

export default async function publishWeb(options, config) {
  log.debug('options', options);
  log.info('publishing web . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildWeb(options, config);
  if (_.get(config, 'publish.web')) {
    for (const script in config.publish.web) {
      await easycp(script);
    }
  }
}
