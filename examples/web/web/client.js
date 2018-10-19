import 'babel-polyfill';
import { App } from '@reactant/web';

const app = new App({
  props: {}
});
app.register('howdy');
app.render();

export default app;
