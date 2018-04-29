import easycp from 'easycp';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function publishExpo(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: PUBLISH EXPO :::');
  await easycp('exp publish');
}
