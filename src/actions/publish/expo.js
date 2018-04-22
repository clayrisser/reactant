import easycp from 'easycp';
import log from '../../log';

export default async function publishExpo(options) {
  log.debug('options', options);
  log.info('publishing expo . . .');
  await easycp('exp publish');
}
