import easycp from 'easycp';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: BUILD ANDROID :::');
  await easycp('react-native bundle');
}
