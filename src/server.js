import 'babel-polyfill';
import app from '~/../web/server';
import express from 'express';
import path from 'path';
import { __express as ejs } from 'ejs';
// eslint-disable-next-line import/no-unresolved
import { config, log } from 'reaction';
import { createServer } from 'http';

app.disable('x-powered-by');

let errorApp = null;

if (module.hot) {
  errorApp = express();
  errorApp.disable('x-powered-by');
  errorApp.set('views', path.resolve(__dirname, 'views'));
  errorApp.set('view engine', 'ejs');
  errorApp.engine('.ejs', ejs);
  errorApp.use(express.static(path.resolve(__dirname, 'views')));
  errorApp.use((req, res) => {
    return res.render('error', { config, errStack: req.err.stack });
  });
}

app.use((err, req, res, _next) => {
  if (err) {
    log.error(err);
    if (module.hot) {
      req.err = err;
      return errorApp.handle(req, res);
    }
    return res.status(500).send('Server error');
  }
  return res.status(404).send('Page not found');
});

const server = createServer(app);

server.listen(config.port, err => {
  if (err) throw err;
  log.info(`listening on port ${config.port}`);
  if (module.hot) {
    module.hot.accept('~/../web/server.js', () => {
      log.info('[HMR] updating HMR . . .');
    });
    log.info('[HMR] server HMR enabled');
  }
});

export default app;
