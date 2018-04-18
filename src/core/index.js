import 'idempotent-babel-polyfill';
import { createServer } from 'http';
import { log } from 'reaction-build';
import app from './server';
import config from '../config';

const server = createServer(app);

// if (module.hot) {
//   module.hot.accept('./server', () => {
//     // eslint-disable-next-line no-console
//     console.log('🔁 HMR reloading `./server` ...');
//   });
//   // eslint-disable-next-line no-console
//   console.info('✅ server HMR enabled!');
// }

server.listen(config.port, err => {
  if (err) {
    log.error(err);
    return false;
  }
  log.info(`listening on port ${config.port}`);
  return true;
});

export default app;
