// eslint-disable-next-line import/no-unresolved
import { KeepAwake, registerRootComponent } from 'expo';
import App from '~/../expo';

if (process.env.NODE_ENV === 'development') KeepAwake.activate();

registerRootComponent(App);
