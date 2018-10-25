import 'babel-polyfill';
import ClientApp from '@reactant/web-isomorphic/ClientApp';
import Redux from '@reactant/redux';
import StyledComponents from '@reactant/styled-components';
import ClientRoot from './ClientRoot';

const app = new ClientApp(ClientRoot);
app.register(StyledComponents);
app.register(Redux);

export default app.init();
