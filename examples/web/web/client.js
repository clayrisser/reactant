import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

async function createApp() {
  const app = new App(ClientRoot, {
    props: {}
  });
  await app.register(StyledComponents);
  return app.init();
}

export default createApp();
