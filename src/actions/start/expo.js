import easycp from 'easycp';
import log from '~/log';

export default async function startExpo(options) {
  log.debug('options', options);
  log.info('starting expo . . .');
  await easycp('exp start');
}
