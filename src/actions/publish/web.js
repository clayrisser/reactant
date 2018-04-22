import _ from 'lodash';
import buildWeb from '~/actions/build/web';
import createConfig from '~/createConfig';
import easycp from 'easycp';
import log from '~/log';
import Promise from 'bluebird';

export default async function publishWeb(options, config) {
  log.debug('options', options);
  log.info('publishing web . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildWeb(options, config);
  if (_.get(config, 'publish.web')) {
    await Promise.mapSeries(config.publish.web, async script => {
      await easycp(script);
    });
  }
}
