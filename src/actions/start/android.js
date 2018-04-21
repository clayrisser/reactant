import easycp from 'easycp';
import log from '~/log';

export default async function startAndroid(options) {
  log.debug('options', options);
  log.info('starting android . . .');
  await easycp('adb reverse tcp:8081 tcp:8081');
  setTimeout(async () => easycp('react-native run-android'), 5000);
  await easycp('react-native start');
}
