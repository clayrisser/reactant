import 'babel-polyfill';
import ClientApp from '@reactant/web-isomorphic/ClientApp';
import ReactRouter from '@reactant/react-router';
import Redux from '@reactant/redux';
import Sass from '@reactant/sass';
import StyledComponents from '@reactant/styled-components';
import ClientRoot from './ClientRoot';

const app = new ClientApp(ClientRoot);
app.register(ReactRouter);
app.register(Redux);
app.register(Sass);
app.register(StyledComponents);

export default app.init();
