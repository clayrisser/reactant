import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import ClientApp from '@reactant/web-isomorphic/ClientApp';
import ClientRoot from './ClientRoot';

async function createApp() {
  const app = new ClientApp(ClientRoot, {
    props: {}
  });
  await app.register(StyledComponents);
  return app.init();
}

export default createApp();
