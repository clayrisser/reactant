import easycp from 'easycp';
import log from '../../log';

export default async function buildAndroid(options) {
  log.debug('options', options);
  log.info('building android . . .');
  await easycp('react-native bundle');
}
