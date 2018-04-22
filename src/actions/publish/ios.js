import _ from 'lodash';
import easycp from 'easycp';
import Promise from 'bluebird';
import buildIos from '../build/ios';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishIos(options, config) {
  log.debug('options', options);
  log.info('publishing ios . . .');
  if (!config) config = createConfig({ defaultEnv: 'production' });
  await buildIos(options, config);
  if (_.get(config, 'publish.ios')) {
    await Promise.mapSeries(config.publish.ios, async script => {
      await easycp(script);
    });
  }
}
