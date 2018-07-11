import 'babel-polyfill';
import registerServer from 'reaction-base/register/server';

const initialProps = {};

const { app } = registerServer(initialProps);

export default app;
