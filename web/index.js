import 'babel-polyfill';
import app from '~/core/server';
import config from 'reaction/config';
import { createServer } from 'http';
import { log } from 'reaction-build';

const server = createServer(app);

server.listen(config.port, err => {
  if (err) {
    log.error(err);
    return false;
  }
  log.info(`listening on port ${config.port}`);
  if (module.hot) {
    module.hot.accept('~/core/server.js', () => {
      log.info('updating HMR . . .');
    });
    log.info('server HMR enabled');
  }
  return true;
});

export default app;
