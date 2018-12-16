import '@babel/polyfill';
import ReactRouter from '@reactant/react-router';
import Redux from '@reactant/redux';
import Sass from '@reactant/sass';
import ServerApp from '@reactant/web-isomorphic/ServerApp';
import StyledComponents from '@reactant/styled-components';
import ServerRoot from './ServerRoot';

const app = new ServerApp(ServerRoot);
app.register(ReactRouter);
app.register(Redux);
app.register(Sass);
app.register(StyledComponents);

export default app.init();
