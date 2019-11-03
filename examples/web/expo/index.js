import { registerRootComponent } from 'expo/build/ExpoLazy';
import { activateKeepAwake } from 'expo-keep-awake';

import App from '../../expo/App';

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
