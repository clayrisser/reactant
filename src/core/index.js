import 'babel-polyfill';
import app from '~/core/server';
import config from 'reaction/config';
import hotModule from '~/core/hotModule';
import { createServer } from 'http';
import { log } from 'reaction-build';

const server = createServer(app);

server.listen(config.port, err => {
  if (err) {
    log.error(err);
    return false;
  }
  hotModule();
  log.info(`listening on port ${config.port}`);
  return true;
});

export default app;
