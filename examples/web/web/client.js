import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import Redux from '@reactant/redux';
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

async function createApp() {
  const app = new App(ClientRoot, {
    props: {}
  });
  await app.register(StyledComponents);
  await app.register(Redux);
  return app.init();
}

export default createApp();
