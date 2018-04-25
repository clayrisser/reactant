import 'babel-polyfill';
import app from '~/../web/server';
// eslint-disable-next-line import/no-unresolved
import config from 'reaction/config';
import { createServer } from 'http';
// eslint-disable-next-line import/no-unresolved
import log from 'reaction/log';

const server = createServer(app);

server.listen(config.port, err => {
  if (err) {
    log.error(err);
    return false;
  }
  log.info(`listening on port ${config.port}`);
  if (module.hot) {
    module.hot.accept('~/../web/server.js', () => {
      log.info('[HMR] updating HMR . . .');
    });
    log.info('[HMR] server HMR enabled');
  }
  return true;
});

export default app;
