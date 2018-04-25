import easycp from 'easycp';
import clean from '../clean';
import createConfig from '../../createConfig';
import log from '../../log';

export default async function startAndroid(options, config) {
  if (!config) {
    config = createConfig({ defaultEnv: 'development' });
    log.debug('options', options);
    log.debug('config', config);
  }
  log.info('::: START ANDROID :::');
  await clean(options, config);
  await easycp('adb reverse tcp:8081 tcp:8081');
  setTimeout(async () => easycp('react-native run-android'), 5000);
  await easycp('react-native start --reset-cache');
}
