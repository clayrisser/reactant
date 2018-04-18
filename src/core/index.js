import 'babel-polyfill';
import config from 'reaction/config';
import { createServer } from 'http';
import { log } from 'reaction-build';
import app from './server';

const server = createServer(app);

server.listen(config.port, err => {
  if (err) {
    log.error(err);
    return false;
  }
  log.info(`listening on port ${config.port}`);
  return true;
});

export default app;
