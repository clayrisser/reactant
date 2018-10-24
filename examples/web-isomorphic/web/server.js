import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import ServerApp from '@reactant/web-isomorphic/ServerApp';
import ServerRoot from './ServerRoot';

const app = new ServerApp(ServerRoot, {
  props: {}
});
app.register(StyledComponents);

export default app.init();
