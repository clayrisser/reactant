import 'babel-polyfill';
import StyledComponents from '@reactant/styled-components';
/* import Redux from '@reactant/redux'; */
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

const app = new App(ClientRoot, {
  props: {}
});
app.register(StyledComponents);
/* app.register(Redux); */

export default app.init();
