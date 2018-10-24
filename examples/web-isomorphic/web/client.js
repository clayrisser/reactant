import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import ClientApp from '@reactant/web-isomorphic/ClientApp';
import ClientRoot from './ClientRoot';

const app = new ClientApp(ClientRoot, {
  props: {}
});
app.register(StyledComponents);

export default app.init();
