import _ from 'lodash';
import easycp from 'easycp';
import Promise from 'bluebird';
import buildWeb from '../build/web';
import createConfig from '../../createConfig';
import log from '../../log';

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
