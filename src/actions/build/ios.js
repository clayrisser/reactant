import easycp from 'easycp';
import log from '~/log';

export default async function buildIos(options) {
  log.debug('options', options);
  log.info('building ios . . .');
  await easycp('react-native bundle');
}
