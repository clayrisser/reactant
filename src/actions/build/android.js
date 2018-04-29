import easycp from 'easycp';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function buildAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'production', options });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: BUILD ANDROID :::');
  await clean(options, config);
  await easycp('react-native bundle');
}
