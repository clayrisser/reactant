import { createServer } from 'http';
import app from './server';
import config from '../config';

const server = createServer(app);

if (module.hot) {
  module.hot.accept('./server', () => {
    // eslint-disable-next-line no-console
    console.log('🔁 HMR reloading `./server` ...');
  });
  // eslint-disable-next-line no-console
  console.info('✅ server HMR enabled!');
}

server.listen(config.port, err => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return;
  }
  // eslint-disable-next-line no-console
  console.log(`listening on port ${config.port}`);
});

export default app;
