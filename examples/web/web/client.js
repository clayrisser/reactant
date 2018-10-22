import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

const app = new App(ClientRoot, {
  props: {}
});
app.register(StyledComponents);
app.init();

export default app;
