import easycp from 'easycp';
import log from '../../log';

export default async function startIos(options) {
  log.debug('options', options);
  log.info('starting ios . . .');
  await easycp('adb reverse tcp:8081 tcp:8081');
  setTimeout(async () => easycp('react-native run-ios'), 5000);
  await easycp('react-native start');
}
