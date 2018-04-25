import easycp from 'easycp';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startExpo(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: START EXPO :::');
  await clean(options, config);
  await easycp(`exp start${options.offline ? ' --offline --localhost' : ''}`);
}
