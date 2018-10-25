import 'babel-polyfill';
import Redux from '@reactant/redux';
import ServerApp from '@reactant/web-isomorphic/ServerApp';
import StyledComponents from '@reactant/styled-components';
import ServerRoot from './ServerRoot';

const app = new ServerApp(ServerRoot);
app.register(StyledComponents);
app.register(Redux);

export default app.init();
