import 'babel-polyfill';
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

const app = new App(ClientRoot, {
  props: {}
});
app.register('howdy');
app.render();

export default app;
