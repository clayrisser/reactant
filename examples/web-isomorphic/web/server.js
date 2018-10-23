import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import ServerApp from '@reactant/web-isomorphic/ServerApp';
import ServerRoot from './ServerRoot';

async function createApp() {
  const app = new ServerApp(ServerRoot, {
    props: {}
  });
  await app.register(StyledComponents);
  return app.init();
}

export default createApp();
