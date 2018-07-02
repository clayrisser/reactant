// eslint-disable-next-line import/no-unresolved
import { KeepAwake, registerRootComponent } from 'expo';
import ExpoApp from './ExpoApp';

if (process.env.NODE_ENV === 'development') KeepAwake.activate();

registerRootComponent(ExpoApp);
